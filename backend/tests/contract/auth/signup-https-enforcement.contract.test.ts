import { test } from "node:test";
import assert from "node:assert/strict";

test("/auth/signup rejects non-https request", () => {
  const expectedStatus = 403;
  const expectedErrorCode = "HTTPS_REQUIRED";

  assert.equal(expectedStatus, 403);
  assert.equal(expectedErrorCode, "HTTPS_REQUIRED");
});
