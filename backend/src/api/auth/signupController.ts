import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import type { SignupRequestBody } from "../../domains/auth/SignupModels.js";
import { SignupService, SignupServiceError } from "../../services/auth/SignupService.js";
import { authLogger } from "../../utils/logging/authLogger.js";
import { SignupMetricsService } from "../../services/auth/SignupMetricsService.js";
import { authConfig } from "../../config/authConfig.js";

export class SignupController {
  constructor(
    private readonly signupService: SignupService,
    private readonly metricsService: SignupMetricsService
  ) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    const body = (res.locals.signupBody as SignupRequestBody | undefined) ??
      (req.body as SignupRequestBody);
    const requestId = req.headers["x-request-id"]?.toString() ?? randomUUID();
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";

    const wasCanceled = req.headers["x-signup-canceled"] === "true";
    if (wasCanceled) {
      this.metricsService.trackSignupCanceled(requestId);
      res.status(202).json({ canceled: true });
      return;
    }

    try {
      const simulateSessionFailure = req.headers["x-simulate-session-failure"] === "true";
      const result = await this.signupService.register({
        body,
        requestId,
        clientIp,
        simulateSessionFailure
      });

      authLogger.log("info", { event: "signup_success_response", requestId, ip: clientIp });

      const cookieParts = [
        `session=${requestId}`,
        "HttpOnly",
        "Max-Age=86400",
        "Path=/"
      ];

      if (authConfig.requireHttps) {
        cookieParts.push("Secure");
      }

      res
        .status(201)
        .setHeader("Set-Cookie", cookieParts.join("; "))
        .json(result);
    } catch (error) {
      if (error instanceof SignupServiceError) {
        if (error.retryAfterSeconds) {
          res.setHeader("Retry-After", String(error.retryAfterSeconds));
        }

        res.status(error.statusCode).json({
          errorCode: error.code,
          message: error.message
        });
        return;
      }

      res.status(500).json({
        errorCode: "SIGNUP_FAILED",
        message: "登録に失敗しました。再試行してください。"
      });
    }
  };
}
