import assert from "node:assert/strict";

import { isAccessibilityExpectationMet as isLoginAccessibilityExpectationMet } from "../src/pages/LoginPage/LoginPage.accessibility.test.js";
import { isLoginFailureMappingValid } from "../src/pages/LoginPage/LoginPage.failure.test.js";
import { isLoginInputRetentionExpectationValid } from "../src/pages/LoginPage/LoginPage.input-retention.test.js";
import { isLoginSubmissionStateDesignValid } from "../src/pages/LoginPage/LoginPage.submission-state.test.js";
import { assertLoginSuccessScenario } from "../src/pages/LoginPage/LoginPage.success.test.js";
import { hasExpectedLoginValidationMatrix } from "../src/pages/LoginPage/LoginPage.validation.test.js";
import { isLoginValidationBoundaryMatrixValid } from "../src/pages/LoginPage/loginValidation.test.js";
import { isAccessibilityExpectationMet as isSignupAccessibilityExpectationMet } from "../src/pages/SignupPage/SignupPage.accessibility.test.js";
import { isFailureMappingValid } from "../src/pages/SignupPage/SignupPage.failure.test.js";
import { isInputRetentionExpectationValid as isSignupInputRetentionExpectationValid } from "../src/pages/SignupPage/SignupPage.input-retention.test.js";
import { isSubmissionStateDesignValid as isSignupSubmissionStateDesignValid } from "../src/pages/SignupPage/SignupPage.submission-state.test.js";
import {
  assertSignupSuccessScenario
} from "../src/pages/SignupPage/SignupPage.success.test.js";
import {
  hasExpectedValidationErrorKeys
} from "../src/pages/SignupPage/SignupPage.validation.test.js";
import {
  isValidationBoundaryMatrixValid
} from "../src/pages/SignupPage/signupValidation.test.js";
import { isAccessibilityExpectationMet as isCardAccessibilityExpectationMet } from "../src/pages/CardRegistrationPage/CardRegistrationPage.accessibility.test.js";
import { isInputRetentionExpectationValid as isCardInputRetentionExpectationValid } from "../src/pages/CardRegistrationPage/CardRegistrationPage.input-retention.test.js";
import { isSubmissionStateDesignValid as isCardSubmissionStateDesignValid } from "../src/pages/CardRegistrationPage/CardRegistrationPage.submission-state.test.js";
import { hasExpectedCardValidationMatrix } from "../src/pages/CardRegistrationPage/CardRegistrationPage.validation.test.js";
import { isDefaultDashboardRenderingValid } from "../src/App.base-screen.test.js";
import { isHeaderNavigationIntegrationValid } from "../src/App.navigation.test.js";
import { hasExpectedCardListSearchControls } from "../src/pages/CardListPage/CardListPage.search.test.js";
import { hasExpectedCardListActionControls } from "../src/pages/CardListPage/CardListPage.actions.test.js";
import { isBaseLayoutPageSlotPlacementValid } from "../src/components/layout/BaseLayout.test.js";
import { isSharedHeaderVisibleAcrossAuthenticatedPages } from "../src/components/layout/BaseLayout.persistence.test.js";
import { areHeaderLinksCorrect } from "../src/components/navigation/HeaderMenu.test.js";
import { isHeaderAccessibilityExpectationMet } from "../src/components/navigation/HeaderMenu.accessibility.test.js";
import { isDashboardPagePlainLayoutValid } from "../src/pages/DashboardPage/DashboardPage.layout.test.js";
import { isCardListPagePlainLayoutValid } from "../src/pages/CardListPage/CardListPage.layout.test.js";
import { isReviewPagePlainLayoutValid } from "../src/pages/ReviewPage/ReviewPage.layout.test.js";
import { isSettingsPagePlainLayoutValid } from "../src/pages/SettingsPage/SettingsPage.layout.test.js";
import { isBaseScreenRouteResolutionStable } from "../src/utils/baseScreenRoutes.test.js";

const cases: Array<[string, boolean]> = [
  ["base screen default dashboard", isDefaultDashboardRenderingValid()],
  ["base screen navigation integration", isHeaderNavigationIntegrationValid()],
  ["base layout page slot placement", isBaseLayoutPageSlotPlacementValid()],
  ["shared header persistence", isSharedHeaderVisibleAcrossAuthenticatedPages()],
  ["header link labels and destinations", areHeaderLinksCorrect()],
  ["header accessibility expectations", isHeaderAccessibilityExpectationMet()],
  ["login success scenario", assertLoginSuccessScenario()],
  ["login submission state design", isLoginSubmissionStateDesignValid],
  ["login accessibility expectations", isLoginAccessibilityExpectationMet],
  ["login validation boundary matrix", isLoginValidationBoundaryMatrixValid()],
  ["login validation error keys", hasExpectedLoginValidationMatrix()],
  ["login failure mapping", isLoginFailureMappingValid],
  ["login input retention", isLoginInputRetentionExpectationValid],
  ["signup success scenario", assertSignupSuccessScenario()],
  ["signup submission state design", isSignupSubmissionStateDesignValid],
  ["signup accessibility expectations", isSignupAccessibilityExpectationMet],
  ["validation boundary matrix", isValidationBoundaryMatrixValid],
  ["validation error keys", hasExpectedValidationErrorKeys()],
  ["failure mapping", isFailureMappingValid],
  ["signup input retention", isSignupInputRetentionExpectationValid],
  ["card validation matrix", hasExpectedCardValidationMatrix()],
  ["card submission state design", isCardSubmissionStateDesignValid],
  ["card accessibility expectations", isCardAccessibilityExpectationMet],
  ["card input retention", isCardInputRetentionExpectationValid()],
  ["card list search controls", hasExpectedCardListSearchControls()],
  ["card list action controls", hasExpectedCardListActionControls()],
  ["dashboard plain layout", isDashboardPagePlainLayoutValid()],
  ["card list plain layout", isCardListPagePlainLayoutValid()],
  ["review plain layout", isReviewPagePlainLayoutValid()],
  ["settings plain layout", isSettingsPagePlainLayoutValid()],
  ["base screen route resolution", isBaseScreenRouteResolutionStable()]
];

for (const [name, passed] of cases) {
  assert.equal(passed, true, `${name} failed`);
}

console.log(`Frontend tests passed: ${cases.length}`);
