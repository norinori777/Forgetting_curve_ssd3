import { mapSignupError } from "./signupErrorMapper";

export const retentionExpectation = {
  keepEmailOnFailure: true,
  clearPasswordOnFailure: true,
  clearPasswordConfirmOnFailure: true,
  mappedErrorTitleExists: mapSignupError("SIGNUP_FAILED").title.length > 0
};

export const isInputRetentionExpectationValid =
  retentionExpectation.keepEmailOnFailure &&
  retentionExpectation.clearPasswordOnFailure &&
  retentionExpectation.clearPasswordConfirmOnFailure &&
  retentionExpectation.mappedErrorTitleExists;
