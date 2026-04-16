import { validateSignupInput } from "./signupValidation";

export const validationDisplayScenario = {
  values: {
    email: "not-mail",
    password: "1234567",
    passwordConfirm: "different"
  },
  expectedErrorKeys: ["email", "password", "passwordConfirm"]
};

export const hasExpectedValidationErrorKeys = (): boolean => {
  const errors = validateSignupInput(validationDisplayScenario.values);
  return validationDisplayScenario.expectedErrorKeys.every((key) => key in errors);
};
