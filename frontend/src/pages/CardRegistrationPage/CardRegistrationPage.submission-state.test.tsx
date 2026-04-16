export const submissionStateExpectations = {
  hasPreviewState: true,
  hasConfirmState: true,
  blocksDuplicateSubmit: true,
  disablesActionsDuringRequest: true
};

export const isSubmissionStateDesignValid = Object.values(submissionStateExpectations).every(Boolean);