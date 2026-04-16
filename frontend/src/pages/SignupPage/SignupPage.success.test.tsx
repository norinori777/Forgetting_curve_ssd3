import { validateSignupInput } from "./signupValidation";

export const signupSuccessScenario = {
  input: {
    email: "new-user@example.com",
    password: "password-123",
    passwordConfirm: "password-123"
  },
  expectation: "validation passes and submit hook can call API"
};

export const assertSignupSuccessScenario = (): boolean => {
  const errors = validateSignupInput(signupSuccessScenario.input);
  return Object.keys(errors).length === 0;
};
