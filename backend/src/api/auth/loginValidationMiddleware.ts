import type { NextFunction, Request, Response } from "express";
import type {
  LoginErrorResponse,
  LoginRequestBody,
  LoginValidationResult
} from "../../domains/auth/LoginModels.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateLoginBody = (body: Partial<LoginRequestBody>): LoginValidationResult => {
  const fieldErrors: LoginValidationResult["fieldErrors"] = {};

  if (!body.email || !EMAIL_PATTERN.test(body.email.trim())) {
    fieldErrors.email = "メールアドレスの形式を確認してください。";
  }

  const passwordLength = body.password?.length ?? 0;
  if (passwordLength < 8 || passwordLength > 64) {
    fieldErrors.password = "パスワードは8文字以上64文字以下で入力してください。";
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors
  };
};

export const loginValidationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const body = (req.body ?? {}) as Partial<LoginRequestBody>;
  const validation = validateLoginBody(body);

  if (!validation.isValid) {
    const response: LoginErrorResponse = {
      errorCode: "VALIDATION_FAILED",
      message: "入力内容を確認してください。",
      fieldErrors: validation.fieldErrors
    };

    res.status(400).json(response);
    return;
  }

  res.locals.loginBody = {
    email: body.email,
    password: body.password
  } as LoginRequestBody;
  next();
};