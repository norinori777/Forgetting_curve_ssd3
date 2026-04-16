import { test } from "node:test";
import assert from "node:assert/strict";
import { CardRepository } from "../../../src/repositories/cards/cardRepository.js";
import { CardService } from "../../../src/services/cards/CardService.js";

test("authenticated preview-to-create happy path returns matching review schedule", async () => {
  const repository = new CardRepository();
  const service = new CardService(repository);
  const draft = {
    title: "英語の基本単語",
    question: "What is the capital of France?",
    answer: "Paris",
    memo: "Geography basics",
    labels: ["英語"]
  };
  const now = new Date("2026-04-12T00:00:00.000Z");

  const preview = await service.preview({ draft, currentUserId: "user-1", requestId: "request-1", now });
  const created = await service.create({ draft, currentUserId: "user-1", requestId: "request-1", now });

  assert.equal(preview.isValid, true);
  assert.equal(created.cardId.length > 0, true);
  assert.equal(created.redirectTo, "/dashboard");
  assert.equal(created.reviewSchedule.firstReviewAt.toISOString(), preview.reviewSchedule.firstReviewAt.toISOString());
  assert.equal(repository.getCardCount(), 1);
});