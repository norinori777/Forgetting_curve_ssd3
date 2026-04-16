import type { NextFunction, Request, Response } from "express";
import { authConfig } from "../../config/authConfig.js";
import type { SignupErrorResponse } from "../../domains/auth/SignupModels.js";

const HTTPS_BLOCK_RESPONSE: SignupErrorResponse = {
  errorCode: "HTTPS_REQUIRED",
  message: "HTTPS接続でアクセスしてください。"
};

const isHttpsRequest = (req: Request): boolean => {
  if (req.secure) {
    return true;
  }

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (typeof forwardedProto === "string") {
    return forwardedProto.toLowerCase() === "https";
  }

  if (Array.isArray(forwardedProto)) {
    return forwardedProto.some((entry) => entry.toLowerCase() === "https");
  }

  return false;
};

export const requireHttps = (req: Request, res: Response, next: NextFunction): void => {
  if (!authConfig.requireHttps || isHttpsRequest(req)) {
    next();
    return;
  }

  res.status(403).json(HTTPS_BLOCK_RESPONSE);
};
