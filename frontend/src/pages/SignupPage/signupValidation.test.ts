import { validateSignupInput } from "./signupValidation";

export const signupValidationBoundaryCases = [
  {
    name: "password length 7 fails",
    values: { email: "a@example.com", password: "1234567", passwordConfirm: "1234567" },
    hasPasswordError: true
  },
  {
    name: "password length 8 passes",
    values: { email: "a@example.com", password: "12345678", passwordConfirm: "12345678" },
    hasPasswordError: false
  },
  {
    name: "password length 64 passes",
    values: {
      email: "a@example.com",
      password: "x".repeat(64),
      passwordConfirm: "x".repeat(64)
    },
    hasPasswordError: false
  },
  {
    name: "password length 65 fails",
    values: {
      email: "a@example.com",
      password: "x".repeat(65),
      passwordConfirm: "x".repeat(65)
    },
    hasPasswordError: true
  }
] as const;

export const isValidationBoundaryMatrixValid = signupValidationBoundaryCases.every((item) => {
  const errors = validateSignupInput(item.values);
  return Boolean(errors.password) === item.hasPasswordError;
});
