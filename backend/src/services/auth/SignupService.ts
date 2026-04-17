import type {
  SignupErrorCode,
  SignupRequestBody,
  SignupSuccessResponse
} from "../../domains/auth/SignupModels.js";
import { authConfig } from "../../config/authConfig.js";
import { hashPassword, normalizeEmail } from "../../utils/auth/credentialUtils.js";
import { authLogger } from "../../utils/logging/authLogger.js";
import { SignupRepository } from "../../repositories/auth/signupRepository.js";
import { SignupGuardService } from "./SignupGuardService.js";
import { SignupMetricsService } from "./SignupMetricsService.js";

export class SignupServiceError extends Error {
  constructor(
    public readonly code: SignupErrorCode,
    public readonly statusCode: number,
    message: string,
    public readonly retryAfterSeconds?: number
  ) {
    super(message);
    this.name = "SignupServiceError";
  }
}

type SignupServiceInput = {
  body: SignupRequestBody;
  requestId: string;
  clientIp: string;
  simulateSessionFailure?: boolean;
};

export class SignupService {
  constructor(
    private readonly repository: SignupRepository,
    private readonly guardService: SignupGuardService,
    private readonly metricsService: SignupMetricsService
  ) {}

  async register(input: SignupServiceInput): Promise<SignupSuccessResponse> {
    const now = new Date();
    const normalizedEmail = normalizeEmail(input.body.email);

    this.metricsService.trackSignupStarted(input.requestId);

    if (this.guardService.isRateLimited(normalizedEmail, input.clientIp, now)) {
      throw new SignupServiceError(
        "RATE_LIMIT_EXCEEDED",
        429,
        "しばらく待ってから再試行してください。",
        60
      );
    }

    if (await this.repository.isDuplicateEmail(normalizedEmail)) {
      throw new SignupServiceError("DUPLICATE_EMAIL", 409, "このメールアドレスは既に登録されています。");
    }

    const passwordHash = hashPassword(input.body.password);

    try {
      const result = await this.repository.withTransaction(async (tx) => {
        const user = await tx.createUser({
          normalizedEmail,
          passwordHash,
          now
        });

        if (input.simulateSessionFailure) {
          throw new Error("session-create-failed");
        }

        await tx.createSession({
          userId: user.userId,
          issuedAt: now,
          ttlSeconds: authConfig.sessionTtlSeconds,
          sessionId: input.requestId
        });

        return {
          userId: user.userId,
          redirectTo: "/dashboard" as const,
          sessionExpiresInSeconds: authConfig.sessionTtlSeconds
        };
      });

      this.metricsService.trackSignupSucceeded(input.requestId);
      authLogger.log("info", {
        event: "signup_succeeded",
        requestId: input.requestId,
        normalizedEmail,
        ip: input.clientIp
      });

      return result;
    } catch {
      authLogger.log("error", {
        event: "signup_failed",
        requestId: input.requestId,
        normalizedEmail,
        ip: input.clientIp,
        errorCode: "SIGNUP_FAILED"
      });
      throw new SignupServiceError("SIGNUP_FAILED", 500, "登録に失敗しました。再試行してください。");
    }
  }
}
