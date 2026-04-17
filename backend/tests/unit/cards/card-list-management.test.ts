import assert from "node:assert/strict";
import { test } from "node:test";
import { CardRepository } from "../../../src/repositories/cards/cardRepository.js";
import { CardService, CardServiceError } from "../../../src/services/cards/CardService.js";

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
): Promise<void> => {
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
};

const seedCardAndGetId = async (
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
  await seedCard(repository, input);
  return repository.getCardByRequestId(input.requestId)?.cardId ?? "";
};

test("card list returns only owned cards and paginates deterministically", async () => {
  const repository = new CardRepository();
  const service = new CardService(repository);

  await seedCard(repository, {
    userId: "user-a",
    requestId: "request-1",
    title: "alpha card",
    question: "question one",
    labels: ["英語"],
    now: "2026-04-01T00:00:00.000Z"
  });
  await seedCard(repository, {
    userId: "user-a",
    requestId: "request-2",
    title: "beta card",
    question: "question two",
    labels: ["文法"],
    now: "2026-04-02T00:00:00.000Z"
  });
  await seedCard(repository, {
    userId: "user-b",
    requestId: "request-3",
    title: "other user's card",
    question: "question three",
    labels: ["英語"],
    now: "2026-04-03T00:00:00.000Z"
  });

  const firstPage = await service.list({ currentUserId: "user-a", requestId: "list-1", limit: 1 });

  assert.equal(firstPage.items.length, 1);
  assert.equal(firstPage.items[0].title, "beta card");
  assert.equal(firstPage.nextCursor, "2026-04-02T00:00:00.000Z::" + firstPage.items[0].cardId);

  const secondPage = await service.list({ currentUserId: "user-a", requestId: "list-2", cursor: firstPage.nextCursor ?? undefined, limit: 1 });

  assert.equal(secondPage.items.length, 1);
  assert.equal(secondPage.items[0].title, "alpha card");
  assert.equal(secondPage.nextCursor, null);
});

test("card list filters by search text and labels", async () => {
  const repository = new CardRepository();
  const service = new CardService(repository);

  await seedCard(repository, {
    userId: "user-a",
    requestId: "request-1",
    title: "grammar drill",
    question: "question one",
    labels: ["文法", "英語"],
    now: "2026-04-01T00:00:00.000Z"
  });
  await seedCard(repository, {
    userId: "user-a",
    requestId: "request-2",
    title: "vocabulary drill",
    question: "search target",
    labels: ["語彙"],
    now: "2026-04-02T00:00:00.000Z"
  });

  const filtered = await service.list({ currentUserId: "user-a", requestId: "list-3", search: "target", labels: ["語彙"] });

  assert.equal(filtered.items.length, 1);
  assert.equal(filtered.items[0].title, "vocabulary drill");
});

test("card list rejects missing user context", async () => {
  const repository = new CardRepository();
  const service = new CardService(repository);

  await assert.rejects(
    async () => {
      await service.list({ currentUserId: "", requestId: "list-4" });
    },
    (error: unknown) => error instanceof CardServiceError && error.code === "AUTH_REQUIRED" && error.statusCode === 401
  );
});

test("card bulk label updates owned cards and keeps labels unique", async () => {
  const repository = new CardRepository();
  const service = new CardService(repository);

  const firstCardId = await seedCardAndGetId(repository, {
    userId: "user-a",
    requestId: "request-1",
    title: "alpha card",
    question: "question one",
    labels: ["英語"],
    now: "2026-04-01T00:00:00.000Z"
  });
  const secondCardId = await seedCardAndGetId(repository, {
    userId: "user-a",
    requestId: "request-2",
    title: "beta card",
    question: "question two",
    labels: ["文法"],
    now: "2026-04-02T00:00:00.000Z"
  });
  await seedCardAndGetId(repository, {
    userId: "user-b",
    requestId: "request-3",
    title: "other user's card",
    question: "question three",
    labels: ["試験対策"],
    now: "2026-04-03T00:00:00.000Z"
  });

  const result = await service.bulkLabel({
    currentUserId: "user-a",
    requestId: "bulk-1",
    cardIds: [firstCardId, secondCardId],
    labels: ["英語", "試験対策", "英語"]
  });

  assert.equal(result.updatedCount, 2);
  assert.deepEqual(repository.getCardById(firstCardId)?.labels, ["英語", "試験対策"]);
  assert.deepEqual(repository.getCardById(secondCardId)?.labels, ["文法", "英語", "試験対策"]);
});

test("card bulk label rejects empty selection", async () => {
  const repository = new CardRepository();
  const service = new CardService(repository);

  await assert.rejects(
    async () => {
      await service.bulkLabel({ currentUserId: "user-a", requestId: "bulk-2", cardIds: [], labels: ["英語"] });
    },
    (error: unknown) => error instanceof CardServiceError && error.code === "VALIDATION_FAILED" && error.statusCode === 400
  );
});

test("card delete removes owned cards and rejects other users", async () => {
  const repository = new CardRepository();
  const service = new CardService(repository);

  const ownedCardId = await seedCardAndGetId(repository, {
    userId: "user-a",
    requestId: "request-1",
    title: "owned card",
    question: "question one",
    labels: ["英語"],
    now: "2026-04-01T00:00:00.000Z"
  });
  const foreignCardId = await seedCardAndGetId(repository, {
    userId: "user-b",
    requestId: "request-2",
    title: "foreign card",
    question: "question two",
    labels: ["文法"],
    now: "2026-04-02T00:00:00.000Z"
  });

  const result = await service.delete({ currentUserId: "user-a", requestId: "delete-1", cardId: ownedCardId });

  assert.equal(result.deletedCardId, ownedCardId);
  assert.equal(repository.getCardById(ownedCardId), undefined);
  assert.equal(repository.getCardById(foreignCardId)?.title, "foreign card");

  await assert.rejects(
    async () => {
      await service.delete({ currentUserId: "user-a", requestId: "delete-2", cardId: foreignCardId });
    },
    (error: unknown) => error instanceof CardServiceError && error.code === "FORBIDDEN" && error.statusCode === 403
  );
});

test("card export returns filtered owned cards only", async () => {
  const repository = new CardRepository();
  const service = new CardService(repository);

  await seedCard(repository, {
    userId: "user-a",
    requestId: "request-1",
    title: "grammar drill",
    question: "question one",
    labels: ["文法"],
    now: "2026-04-01T00:00:00.000Z"
  });
  await seedCard(repository, {
    userId: "user-a",
    requestId: "request-2",
    title: "vocabulary drill",
    question: "search target",
    labels: ["語彙"],
    now: "2026-04-02T00:00:00.000Z"
  });
  await seedCard(repository, {
    userId: "user-b",
    requestId: "request-3",
    title: "foreign drill",
    question: "search target",
    labels: ["語彙"],
    now: "2026-04-03T00:00:00.000Z"
  });

  const exported = await service.export({ currentUserId: "user-a", requestId: "export-1", search: "drill", labels: ["語彙"] });

  assert.equal(exported.cards.length, 1);
  assert.equal(exported.cards[0].title, "vocabulary drill");
  assert.deepEqual(exported.filters, { search: "drill", labels: ["語彙"] });
  assert.equal(typeof exported.exportedAt, "string");
});