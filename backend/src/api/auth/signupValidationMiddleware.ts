import type { NextFunction, Request, Response } from "express";
import type {
  SignupErrorResponse,
  SignupRequestBody,
  SignupValidationResult
} from "../../domains/auth/SignupModels.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateSignupBody = (body: Partial<SignupRequestBody>): SignupValidationResult => {
  const fieldErrors: SignupValidationResult["fieldErrors"] = {};

  if (!body.email || !EMAIL_PATTERN.test(body.email.trim())) {
    fieldErrors.email = "メールアドレスの形式を確認してください。";
  }

  const passwordLength = body.password?.length ?? 0;
  if (passwordLength < 8 || passwordLength > 64) {
    fieldErrors.password = "パスワードは8文字以上64文字以下で入力してください。";
  }

  if (!body.passwordConfirm || body.passwordConfirm !== body.password) {
    fieldErrors.passwordConfirm = "確認用パスワードが一致しません。";
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors
  };
};

export const signupValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const body = (req.body ?? {}) as Partial<SignupRequestBody>;
  const validation = validateSignupBody(body);

  if (!validation.isValid) {
    const response: SignupErrorResponse = {
      errorCode: "VALIDATION_FAILED",
      message: "入力内容を確認してください。",
      fieldErrors: validation.fieldErrors
    };

    res.status(400).json(response);
    return;
  }

  res.locals.signupBody = {
    email: body.email,
    password: body.password,
    passwordConfirm: body.passwordConfirm
  } as SignupRequestBody;
  next();
};
