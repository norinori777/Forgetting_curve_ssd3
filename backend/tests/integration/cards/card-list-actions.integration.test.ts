import assert from "node:assert/strict";
import { test } from "node:test";
import { CardRepository } from "../../../src/repositories/cards/cardRepository.js";
import { CardService } from "../../../src/services/cards/CardService.js";

const buildSchedule = (iso: string) => {
  const baseDate = new Date(iso);

  return {
    firstReviewAt: new Date(baseDate.getTime() + 1_000),
    secondReviewAt: new Date(baseDate.getTime() + 2_000),
    thirdReviewAt: new Date(baseDate.getTime() + 3_000),
    fourthReviewAt: new Date(baseDate.getTime() + 4_000),
    timezone: "Asia/Tokyo",
    policyVersion: "initial-v1"
  };
};

const seedCard = async (
  repository: CardRepository,
  input: {
    userId: string;
    requestId: string;
    title: string;
    question: string;
    labels: string[];
    now: string;
  }
): Promise<string> => {
  await repository.withTransaction(async (tx) => {
    await tx.createCard({
      userId: input.userId,
      requestId: input.requestId,
      draft: {
        title: input.title,
        question: input.question,
        answer: `${input.title} answer`,
        memo: `${input.title} memo`,
        labels: input.labels
      },
      reviewSchedule: buildSchedule(input.now),
      now: new Date(input.now)
    });
  });

  return repository.getCardByRequestId(input.requestId)?.cardId ?? "";
};

test("card list actions persist through bulk update, delete, and export", async () => {
  const repository = new CardRepository();
  const service = new CardService(repository);

  const firstCardId = await seedCard(repository, {
    userId: "user-a",
    requestId: "request-1",
    title: "alpha card",
    question: "question one",
    labels: ["英語"],
    now: "2026-04-01T00:00:00.000Z"
  });
  const secondCardId = await seedCard(repository, {
    userId: "user-a",
    requestId: "request-2",
    title: "beta card",
    question: "question two",
    labels: ["文法"],
    now: "2026-04-02T00:00:00.000Z"
  });

  const bulkResult = await service.bulkLabel({
    currentUserId: "user-a",
    requestId: "bulk-1",
    cardIds: [firstCardId, secondCardId],
    labels: ["試験対策"]
  });

  assert.equal(bulkResult.updatedCount, 2);
  assert.equal(repository.getCardById(firstCardId)?.labels.includes("試験対策"), true);

  const deleteResult = await service.delete({ currentUserId: "user-a", requestId: "delete-1", cardId: firstCardId });

  assert.equal(deleteResult.deletedCardId, firstCardId);
  assert.equal(repository.getCardById(firstCardId), undefined);

  const exported = await service.export({ currentUserId: "user-a", requestId: "export-1", labels: ["試験対策"] });

  assert.equal(exported.cards.length, 1);
  assert.equal(exported.cards[0].cardId, secondCardId);
});