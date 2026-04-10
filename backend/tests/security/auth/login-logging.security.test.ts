import { test } from "node:test";
import assert from "node:assert/strict";
import { authLogger } from "../../../src/utils/logging/authLogger.js";

test("auth logger does not throw when given login pii fields", () => {
  authLogger.log("info", {
    event: "login_attempt",
    normalizedEmail: "person@example.com",
    ip: "127.0.0.1"
  });

  assert.ok(true);
});