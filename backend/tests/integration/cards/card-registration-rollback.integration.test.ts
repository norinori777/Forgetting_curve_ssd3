import { test } from "node:test";
import assert from "node:assert/strict";
import { CardRepository } from "../../../src/repositories/cards/cardRepository.js";
import { CardService } from "../../../src/services/cards/CardService.js";

test("duplicate request id is idempotent and ownership conflict is rejected", async () => {
  const repository = new CardRepository();
  const service = new CardService(repository);
  const draft = {
    title: "英単語",
    question: "apple",
    answer: "りんご",
    memo: "daily word",
    labels: ["英語"]
  };

  const first = await service.create({ draft, currentUserId: "user-1", requestId: "request-dup", now: new Date("2026-04-12T00:00:00.000Z") });
  const second = await service.create({ draft, currentUserId: "user-1", requestId: "request-dup", now: new Date("2026-04-12T00:00:00.000Z") });

  assert.equal(first.cardId, second.cardId);
  assert.equal(repository.getCardCount(), 1);

  await assert.rejects(async () => {
    await service.create({ draft, currentUserId: "user-2", requestId: "request-dup", now: new Date("2026-04-12T00:00:00.000Z") });
  });
});