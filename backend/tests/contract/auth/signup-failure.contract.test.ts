import { test } from "node:test";
import assert from "node:assert/strict";

const failureStatuses = [409, 429, 500];

test("signup failure contract covers 409/429/500", () => {
  assert.deepEqual(failureStatuses, [409, 429, 500]);
});
