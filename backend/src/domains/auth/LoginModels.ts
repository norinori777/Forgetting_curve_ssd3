import type { UserAccount, UserSession } from "./SignupModels.js";

export type LoginRequestBody = {
  email: string;
  password: string;
};

export type LoginFieldErrors = Partial<Record<"email" | "password", string>>;

export type LoginValidationResult = {
  isValid: boolean;
  fieldErrors: LoginFieldErrors;
};

export type LoginErrorCode =
  | "VALIDATION_FAILED"
  | "INVALID_CREDENTIALS"
  | "RATE_LIMIT_EXCEEDED"
  | "LOGIN_FAILED"
  | "HTTPS_REQUIRED";

export type LoginErrorResponse = {
  errorCode: LoginErrorCode;
  message: string;
  fieldErrors?: LoginFieldErrors;
};

export type LoginSuccessResponse = {
  userId: string;
  redirectTo: string;
  sessionExpiresInSeconds: number;
};

export type LoginErrorSummary = {
  errorType: "invalid_credentials" | "rate_limited" | "transient_failure" | "locked";
  userMessage: string;
  retryable: boolean;
  retryAfterSeconds?: number;
};

export type LoginAttempt = {
  requestId: string;
  normalizedEmail: string;
  requestedAt: Date;
  success: boolean;
};

export type { UserAccount, UserSession };