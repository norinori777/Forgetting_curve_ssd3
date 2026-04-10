import { validateLoginInput } from "./loginValidation";

export const loginValidationCases = [
  { email: "", password: "password-123", expectEmailError: true, expectPasswordError: false },
  { email: " user@example.com ", password: "password-123", expectEmailError: false, expectPasswordError: false },
  { email: "invalid-email", password: "password-123", expectEmailError: true, expectPasswordError: false },
  { email: "user@example.com", password: "short", expectEmailError: false, expectPasswordError: true },
  { email: "user@example.com", password: "x".repeat(64), expectEmailError: false, expectPasswordError: false },
  { email: "user@example.com", password: "x".repeat(65), expectEmailError: false, expectPasswordError: true }
] as const;

export const hasExpectedLoginValidationMatrix = (): boolean => {
  return loginValidationCases.every((item) => {
    const errors = validateLoginInput({ email: item.email, password: item.password });
    return Boolean(errors.email) === item.expectEmailError && Boolean(errors.password) === item.expectPasswordError;
  });
};