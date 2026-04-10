import { mapLoginError } from "./loginErrorMapper";

export const loginRetentionExpectation = {
  keepEmailOnFailure: true,
  clearPasswordOnFailure: true,
  mappedErrorTitleExists: mapLoginError("LOGIN_FAILED").title.length > 0
};

export const isLoginInputRetentionExpectationValid =
  loginRetentionExpectation.keepEmailOnFailure &&
  loginRetentionExpectation.clearPasswordOnFailure &&
  loginRetentionExpectation.mappedErrorTitleExists;