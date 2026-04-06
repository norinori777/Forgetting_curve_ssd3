import { test } from "node:test";
import assert from "node:assert/strict";
import { SignupGuardService } from "../../../src/services/auth/SignupGuardService.js";

test("rate-limit allows first five requests", () => {
  const guard = new SignupGuardService();
  const now = new Date();

  const results = Array.from({ length: 5 }, () => guard.isRateLimited("user@example.com", "127.0.0.1", now));
  assert.deepEqual(results, [false, false, false, false, false]);
});
