import { validateLoginInput } from "./loginValidation";

export const loginValidationBoundaryCases = [
  { email: " user@example.com ", password: "password-123", valid: true },
  { email: "user@example.com", password: "1234567", valid: false },
  { email: "user@example.com", password: "12345678", valid: true },
  { email: "user@example.com", password: "x".repeat(64), valid: true },
  { email: "user@example.com", password: "x".repeat(65), valid: false }
] as const;

export const isLoginValidationBoundaryMatrixValid = (): boolean => {
  return loginValidationBoundaryCases.every((item) => {
    const errors = validateLoginInput({ email: item.email, password: item.password });
    const hasErrors = Object.keys(errors).length > 0;
    return (!hasErrors) === item.valid;
  });
};