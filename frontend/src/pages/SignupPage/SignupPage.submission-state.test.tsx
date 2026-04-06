export type SubmissionStateCase = {
  state: "initial" | "submitting";
  submitButtonDisabled: boolean;
};

export const submissionStateCases: SubmissionStateCase[] = [
  { state: "initial", submitButtonDisabled: false },
  { state: "submitting", submitButtonDisabled: true }
];

export const isSubmissionStateDesignValid = submissionStateCases.every((item) => {
  if (item.state === "submitting") {
    return item.submitButtonDisabled;
  }

  return !item.submitButtonDisabled;
});
