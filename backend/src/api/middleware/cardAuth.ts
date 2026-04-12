import type { NextFunction, Request, Response } from "express";
import type { CardAuthContext, CardErrorResponse } from "../../domains/cards/CardModels.js";
import type { AuthStoreState } from "../../repositories/auth/authStore.js";
import { resolveAuthenticatedUser } from "../../repositories/auth/authStore.js";

const parseCookieHeader = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, entry) => {
    const separatorIndex = entry.indexOf("=");

    if (separatorIndex < 0) {
      return cookies;
    }

    const key = entry.slice(0, separatorIndex).trim();
    const value = entry.slice(separatorIndex + 1).trim();

    if (key.length > 0) {
      cookies[key] = value;
    }

    return cookies;
  }, {});
};

const AUTH_REQUIRED_RESPONSE: CardErrorResponse = {
  errorCode: "AUTH_REQUIRED",
  message: "カード登録にはログインが必要です。"
};

export const getCardSessionId = (req: Request): string | undefined => {
  const cookies = parseCookieHeader(req.headers.cookie);
  return cookies.session;
};

export const assertCardOwnership = (currentUserId: string, ownerUserId: string): void => {
  if (currentUserId !== ownerUserId) {
    const error = new Error("このカードの所有者ではありません。");
    error.name = "CardOwnershipError";
    throw error;
  }
};

export const createCardAuthMiddleware = (authStore: AuthStoreState) => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const sessionId = getCardSessionId(req);

  if (!sessionId) {
    res.status(401).json(AUTH_REQUIRED_RESPONSE);
    return;
  }

  const resolved = resolveAuthenticatedUser(authStore, sessionId);

  if (!resolved) {
    res.status(401).json(AUTH_REQUIRED_RESPONSE);
    return;
  }

  res.locals.cardAuth = {
    userId: resolved.user.userId,
    sessionId: resolved.session.sessionId
  } satisfies CardAuthContext;

  next();
};