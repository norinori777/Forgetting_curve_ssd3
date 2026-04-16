import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import type { LoginRequestBody } from "../../domains/auth/LoginModels.js";
import { LoginService, LoginServiceError } from "../../services/auth/LoginService.js";
import { authLogger } from "../../utils/logging/authLogger.js";
import { authConfig } from "../../config/authConfig.js";

export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    const body = (res.locals.loginBody as LoginRequestBody | undefined) ?? (req.body as LoginRequestBody);
    const requestId = req.headers["x-request-id"]?.toString() ?? randomUUID();
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";

    try {
      const simulateSessionFailure = req.headers["x-simulate-session-failure"] === "true";
      const result = await this.loginService.login({
        body,
        requestId,
        clientIp,
        simulateSessionFailure
      });

      authLogger.log("info", { event: "login_success_response", requestId, ip: clientIp });

      const cookieParts = [
        `session=request-${requestId}`,
        "HttpOnly",
        `Max-Age=${authConfig.sessionTtlSeconds}`,
        "Path=/"
      ];

      if (authConfig.requireHttps) {
        cookieParts.push("Secure");
      }

      res
        .status(200)
        .setHeader("Set-Cookie", cookieParts.join("; "))
        .json(result);
    } catch (error) {
      if (error instanceof LoginServiceError) {
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
        errorCode: "LOGIN_FAILED",
        message: "ログインに失敗しました。再試行してください。"
      });
    }
  };
}