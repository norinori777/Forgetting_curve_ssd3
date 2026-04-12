export const accessibilityExpectations = {
  hasTitleLabel: true,
  hasQuestionLabel: true,
  hasAnswerLabel: true,
  hasMemoLabel: true,
  hasFocusableButtons: true,
  supportsMobileViewport: true
};

export const isAccessibilityExpectationMet = Object.values(accessibilityExpectations).every(Boolean);