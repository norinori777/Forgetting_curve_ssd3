import { validateLoginInput } from "./loginValidation";

export const loginSuccessScenario = {
  input: {
    email: "existing-user@example.com",
    password: "password-123"
  },
  expectation: "validation passes and submit hook can call API"
};

export const assertLoginSuccessScenario = (): boolean => {
  const errors = validateLoginInput(loginSuccessScenario.input);
  return Object.keys(errors).length === 0;
};