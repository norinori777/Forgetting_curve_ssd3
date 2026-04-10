import type {
  LoginErrorCode,
  LoginRequestBody,
  LoginSuccessResponse
} from "../../domains/auth/LoginModels.js";
import { authConfig } from "../../config/authConfig.js";
import { normalizeEmail, verifyPassword } from "../../utils/auth/credentialUtils.js";
import { authLogger } from "../../utils/logging/authLogger.js";
import { LoginRepository } from "../../repositories/auth/loginRepository.js";
import { LoginGuardService } from "./LoginGuardService.js";
import { LoginMetricsService } from "./LoginMetricsService.js";

export class LoginServiceError extends Error {
  constructor(
    public readonly code: LoginErrorCode,
    public readonly statusCode: number,
    message: string,
    public readonly retryAfterSeconds?: number
  ) {
    super(message);
    this.name = "LoginServiceError";
  }
}

type LoginServiceInput = {
  body: LoginRequestBody;
  requestId: string;
  clientIp: string;
  simulateSessionFailure?: boolean;
};

export class LoginService {
  constructor(
    private readonly repository: LoginRepository,
    private readonly guardService: LoginGuardService,
    private readonly metricsService: LoginMetricsService
  ) {}

  async login(input: LoginServiceInput): Promise<LoginSuccessResponse> {
    const now = new Date();
    const normalizedEmail = normalizeEmail(input.body.email);

    this.metricsService.trackLoginStarted(input.requestId);

    if (this.guardService.isRateLimited(normalizedEmail, input.clientIp, now)) {
      throw new LoginServiceError(
        "RATE_LIMIT_EXCEEDED",
        429,
        "しばらく待ってから再試行してください。",
        60
      );
    }

    const user = await this.repository.findUserByEmail(normalizedEmail);
    if (!user || !verifyPassword(input.body.password, user.passwordHash)) {
      this.metricsService.trackLoginFailed(input.requestId);
      throw new LoginServiceError(
        "INVALID_CREDENTIALS",
        401,
        "メールアドレスまたはパスワードが正しくありません。"
      );
    }

    try {
      const result = await this.repository.withTransaction(async (tx) => {
        if (input.simulateSessionFailure) {
          throw new Error("session-create-failed");
        }

        await tx.createSession({
          userId: user.userId,
          issuedAt: now,
          ttlSeconds: authConfig.sessionTtlSeconds
        });

        return {
          userId: user.userId,
          redirectTo: "/dashboard",
          sessionExpiresInSeconds: authConfig.sessionTtlSeconds
        } satisfies LoginSuccessResponse;
      });

      this.metricsService.trackLoginSucceeded(input.requestId);
      authLogger.log("info", {
        event: "login_succeeded",
        requestId: input.requestId,
        normalizedEmail,
        ip: input.clientIp
      });

      return result;
    } catch {
      authLogger.log("error", {
        event: "login_failed",
        requestId: input.requestId,
        normalizedEmail,
        ip: input.clientIp,
        errorCode: "LOGIN_FAILED"
      });
      throw new LoginServiceError("LOGIN_FAILED", 500, "ログインに失敗しました。再試行してください。");
    }
  }
}