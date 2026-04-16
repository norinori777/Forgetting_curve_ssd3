import type { NextFunction, Request, Response } from "express";
import { authConfig } from "../../config/authConfig.js";

const DEFAULT_ALLOWED_METHODS = "GET,POST,PUT,PATCH,DELETE,OPTIONS";
const DEFAULT_ALLOWED_HEADERS = "Content-Type,Authorization,X-Requested-With,X-Request-Id,X-Signup-Canceled,X-Simulate-Session-Failure";
const DEFAULT_EXPOSED_HEADERS = "Retry-After,Set-Cookie";

const getRequestOrigin = (req: Request): string | undefined => {
  const origin = req.headers.origin;

  if (typeof origin === "string") {
    return origin;
  }

  return undefined;
};

const getRequestedHeaders = (req: Request): string => {
  const requestedHeaders = req.headers["access-control-request-headers"];

  if (typeof requestedHeaders === "string" && requestedHeaders.trim().length > 0) {
    return requestedHeaders;
  }

  return DEFAULT_ALLOWED_HEADERS;
};

export const isAllowedCorsOrigin = (origin: string): boolean => authConfig.corsAllowedOrigins.includes(origin);

export const applyCorsHeaders = (res: Response, origin: string, requestedHeaders?: string): void => {
  res.vary("Origin");
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
  res.setHeader("Access-Control-Allow-Headers", requestedHeaders ?? DEFAULT_ALLOWED_HEADERS);
  res.setHeader("Access-Control-Expose-Headers", DEFAULT_EXPOSED_HEADERS);
};

export const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const origin = getRequestOrigin(req);

  if (!origin) {
    next();
    return;
  }

  if (!isAllowedCorsOrigin(origin)) {
    res.status(403).json({
      errorCode: "CORS_ORIGIN_NOT_ALLOWED",
      message: "このオリジンからのアクセスは許可されていません。"
    });
    return;
  }

  applyCorsHeaders(res, origin, getRequestedHeaders(req));

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
};