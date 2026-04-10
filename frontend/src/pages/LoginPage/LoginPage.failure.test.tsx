import { mapLoginError } from "./loginErrorMapper";

export const loginFailureCases = [
  { code: "INVALID_CREDENTIALS", retryable: false },
  { code: "RATE_LIMIT_EXCEEDED", retryable: true },
  { code: "LOGIN_FAILED", retryable: true },
  { code: "HTTPS_REQUIRED", retryable: true }
] as const;

export const isLoginFailureMappingValid = loginFailureCases.every((item) => {
  const mapped = mapLoginError(item.code, 60);
  return mapped.retryable === item.retryable;
});