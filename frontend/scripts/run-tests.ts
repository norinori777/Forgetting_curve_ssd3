import assert from "node:assert/strict";

import { isAccessibilityExpectationMet as isLoginAccessibilityExpectationMet } from "../src/pages/LoginPage/LoginPage.accessibility.test.js";
import { isLoginFailureMappingValid } from "../src/pages/LoginPage/LoginPage.failure.test.js";
import { isLoginInputRetentionExpectationValid } from "../src/pages/LoginPage/LoginPage.input-retention.test.js";
import { isLoginSubmissionStateDesignValid } from "../src/pages/LoginPage/LoginPage.submission-state.test.js";
import { assertLoginSuccessScenario } from "../src/pages/LoginPage/LoginPage.success.test.js";
import { hasExpectedLoginValidationMatrix } from "../src/pages/LoginPage/LoginPage.validation.test.js";
import { isLoginValidationBoundaryMatrixValid } from "../src/pages/LoginPage/loginValidation.test.js";
import {
  isAccessibilityExpectationMet
} from "../src/pages/SignupPage/SignupPage.accessibility.test.js";
import {
  isFailureMappingValid
} from "../src/pages/SignupPage/SignupPage.failure.test.js";
import {
  isInputRetentionExpectationValid
} from "../src/pages/SignupPage/SignupPage.input-retention.test.js";
import {
  isSubmissionStateDesignValid
} from "../src/pages/SignupPage/SignupPage.submission-state.test.js";
import {
  assertSignupSuccessScenario
} from "../src/pages/SignupPage/SignupPage.success.test.js";
import {
  hasExpectedValidationErrorKeys
} from "../src/pages/SignupPage/SignupPage.validation.test.js";
import {
  isValidationBoundaryMatrixValid
} from "../src/pages/SignupPage/signupValidation.test.js";

const cases: Array<[string, boolean]> = [
  ["login success scenario", assertLoginSuccessScenario()],
  ["login submission state design", isLoginSubmissionStateDesignValid],
  ["login accessibility expectations", isLoginAccessibilityExpectationMet],
  ["login validation boundary matrix", isLoginValidationBoundaryMatrixValid()],
  ["login validation error keys", hasExpectedLoginValidationMatrix()],
  ["login failure mapping", isLoginFailureMappingValid],
  ["login input retention", isLoginInputRetentionExpectationValid],
  ["signup success scenario", assertSignupSuccessScenario()],
  ["submission state design", isSubmissionStateDesignValid],
  ["accessibility expectations", isAccessibilityExpectationMet],
  ["validation boundary matrix", isValidationBoundaryMatrixValid],
  ["validation error keys", hasExpectedValidationErrorKeys()],
  ["failure mapping", isFailureMappingValid],
  ["input retention", isInputRetentionExpectationValid]
];

for (const [name, passed] of cases) {
  assert.equal(passed, true, `${name} failed`);
}

console.log(`Frontend tests passed: ${cases.length}`);
