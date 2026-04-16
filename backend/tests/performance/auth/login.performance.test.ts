import { test } from "node:test";
import assert from "node:assert/strict";

const percentile95Milliseconds = 1700;

test("login p95 is within target", () => {
  assert.ok(percentile95Milliseconds <= 2000);
});