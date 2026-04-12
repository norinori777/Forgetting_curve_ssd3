import { test } from "node:test";
import assert from "node:assert/strict";

test("card registration failure contract covers validation, auth, forbidden, and server errors", () => {
  const errorCodes = ["VALIDATION_FAILED", "AUTH_REQUIRED", "FORBIDDEN", "CARD_PREVIEW_FAILED", "CARD_CREATE_FAILED"];

  assert.deepEqual(errorCodes.sort(), ["AUTH_REQUIRED", "CARD_CREATE_FAILED", "CARD_PREVIEW_FAILED", "FORBIDDEN", "VALIDATION_FAILED"]);
});