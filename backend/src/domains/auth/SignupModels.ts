export type SignupRequestBody = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export type SignupFieldErrors = Partial<Record<"email" | "password" | "passwordConfirm", string>>;

export type SignupValidationResult = {
  isValid: boolean;
  fieldErrors: SignupFieldErrors;
};

export type SignupErrorCode =
  | "VALIDATION_FAILED"
  | "DUPLICATE_EMAIL"
  | "RATE_LIMIT_EXCEEDED"
  | "SIGNUP_FAILED"
  | "HTTPS_REQUIRED";

export type SignupErrorResponse = {
  errorCode: SignupErrorCode;
  message: string;
  fieldErrors?: SignupFieldErrors;
};

export type SignupSuccessResponse = {
  userId: string;
  redirectTo: "/dashboard";
  sessionExpiresInSeconds: number;
};

export type UserAccount = {
  userId: string;
  normalizedEmail: string;
  passwordHash: string;
  createdAt: Date;
  status: "active" | "locked";
};

export type UserSession = {
  sessionId: string;
  userId: string;
  issuedAt: Date;
  expiresAt: Date;
  state: "active" | "expired" | "revoked";
};

export type RegistrationErrorSummary = {
  errorType: "duplicate_email" | "rate_limited" | "transient_failure" | "validation_failed";
  userMessage: string;
  retryable: boolean;
  retryAfterSeconds?: number;
};
