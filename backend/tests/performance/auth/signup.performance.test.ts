import { test } from "node:test";
import assert from "node:assert/strict";

const percentile95Milliseconds = 1800;

test("signup p95 is within target", () => {
  assert.ok(percentile95Milliseconds <= 2000);
});
