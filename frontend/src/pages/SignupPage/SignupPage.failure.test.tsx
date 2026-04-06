import { mapSignupError } from "./signupErrorMapper";

export const failureCases = [
  { code: "DUPLICATE_EMAIL", retryable: false },
  { code: "RATE_LIMIT_EXCEEDED", retryable: true },
  { code: "SIGNUP_FAILED", retryable: true }
] as const;

export const isFailureMappingValid = failureCases.every((item) => {
  const mapped = mapSignupError(item.code, 60);
  return mapped.retryable === item.retryable;
});
