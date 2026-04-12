import type { ReviewSchedule } from "../../domains/cards/CardModels.js";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * DAY_IN_MILLISECONDS);

export const computeInitialReviewSchedule = (baseDate: Date = new Date(), timezone = "Asia/Tokyo"): ReviewSchedule => ({
  firstReviewAt: addDays(baseDate, 1),
  secondReviewAt: addDays(baseDate, 7),
  thirdReviewAt: addDays(baseDate, 14),
  fourthReviewAt: addDays(baseDate, 30),
  timezone,
  policyVersion: "initial-v1"
});