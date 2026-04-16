export const accessibilityExpectations = {
  hasEmailLabel: true,
  hasPasswordLabel: true,
  hasPasswordToggleButton: true,
  hasKeyboardFocusableSubmit: true,
  supportsMobileViewport: true
};

export const isAccessibilityExpectationMet = Object.values(accessibilityExpectations).every(Boolean);