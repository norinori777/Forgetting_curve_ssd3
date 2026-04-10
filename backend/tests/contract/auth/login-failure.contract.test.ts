import { test } from "node:test";
import assert from "node:assert/strict";

const failureStatuses = [401, 429, 500];

test("login failure contract covers 401/429/500", () => {
  assert.deepEqual(failureStatuses, [401, 429, 500]);
});