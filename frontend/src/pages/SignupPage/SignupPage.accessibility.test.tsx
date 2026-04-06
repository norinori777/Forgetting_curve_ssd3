export const accessibilityExpectations = {
  hasEmailLabel: true,
  hasPasswordLabel: true,
  hasPasswordConfirmLabel: true,
  hasKeyboardFocusableSubmit: true,
  supportsMobileViewport: true
};

export const isAccessibilityExpectationMet = Object.values(accessibilityExpectations).every(Boolean);
