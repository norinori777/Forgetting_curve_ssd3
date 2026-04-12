import { test } from "node:test";
import assert from "node:assert/strict";
import { computeInitialReviewSchedule } from "../../../src/utils/cards/reviewSchedule.js";

test("review schedule keeps UTC/JST crossover deterministic", () => {
  const baseDate = new Date("2026-04-12T23:30:00.000Z");
  const schedule = computeInitialReviewSchedule(baseDate);

  assert.equal(schedule.timezone, "Asia/Tokyo");
  assert.equal(schedule.policyVersion, "initial-v1");
  assert.equal(schedule.firstReviewAt.toISOString(), "2026-04-13T23:30:00.000Z");
  assert.equal(schedule.secondReviewAt.toISOString(), "2026-04-19T23:30:00.000Z");
  assert.equal(schedule.thirdReviewAt.toISOString(), "2026-04-26T23:30:00.000Z");
  assert.equal(schedule.fourthReviewAt.toISOString(), "2026-05-12T23:30:00.000Z");
});