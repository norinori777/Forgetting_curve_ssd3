export type LoginSubmissionStateCase = {
  state: "initial" | "validation_error" | "submitting" | "success" | "failure" | "locked";
  submitButtonDisabled: boolean;
};

export const loginSubmissionStateCases: LoginSubmissionStateCase[] = [
  { state: "initial", submitButtonDisabled: false },
  { state: "validation_error", submitButtonDisabled: false },
  { state: "submitting", submitButtonDisabled: true },
  { state: "success", submitButtonDisabled: false },
  { state: "failure", submitButtonDisabled: false },
  { state: "locked", submitButtonDisabled: false }
];

export const isLoginSubmissionStateDesignValid = loginSubmissionStateCases.every((item) => {
  if (item.state === "submitting") {
    return item.submitButtonDisabled;
  }

  return !item.submitButtonDisabled;
});