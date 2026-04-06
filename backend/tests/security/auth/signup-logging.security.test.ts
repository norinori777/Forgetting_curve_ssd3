import { test } from "node:test";
import assert from "node:assert/strict";
import { authLogger } from "../../../src/utils/logging/authLogger.js";

test("auth logger does not throw when given pii fields", () => {
  authLogger.log("info", {
    event: "signup_attempt",
    normalizedEmail: "person@example.com",
    ip: "127.0.0.1"
  });

  assert.ok(true);
});
