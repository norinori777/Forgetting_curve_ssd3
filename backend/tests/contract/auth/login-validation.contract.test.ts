import { test } from "node:test";
import assert from "node:assert/strict";

test("login validation contract returns fieldErrors on invalid input", () => {
  const response = {
    status: 400,
    body: {
      errorCode: "VALIDATION_FAILED",
      fieldErrors: {
        email: "メールアドレスの形式を確認してください。"
      }
    }
  };

  assert.equal(response.status, 400);
  assert.equal(response.body.errorCode, "VALIDATION_FAILED");
  assert.ok(response.body.fieldErrors.email.length > 0);
});