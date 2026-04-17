import { randomUUID } from "node:crypto";
import type { CardListQuery, CardRecord, NormalizedCardDraft, ReviewSchedule } from "../../domains/cards/CardModels.js";
import { mapCardRecordToListItem, normalizeCardLabels } from "../../domains/cards/CardModels.js";
import type { PrismaCardRecord, PrismaClientLike, PrismaTransactionClientLike } from "../../lib/prisma.js";

export type CardRepositoryState = {
  cardsById: Map<string, CardRecord>;
  cardsByRequestId: Map<string, CardRecord>;
  persistToDatabase: boolean;
  prismaClient?: PrismaClientLike;
};

export const createCardStore = (): CardRepositoryState => ({
  cardsById: new Map<string, CardRecord>(),
  cardsByRequestId: new Map<string, CardRecord>(),
  persistToDatabase: false
});

export const cloneCardStore = (source: CardRepositoryState): CardRepositoryState => ({
  cardsById: new Map(source.cardsById),
  cardsByRequestId: new Map(source.cardsByRequestId),
  persistToDatabase: source.persistToDatabase,
  prismaClient: source.prismaClient
});

const mapCardRecord = (record: PrismaCardRecord): CardRecord => ({
  cardId: record.id,
  requestId: record.requestId,
  userId: record.userId,
  title: record.title,
  question: record.question,
  answer: record.answer,
  memo: record.memo,
  labels: [...record.labels],
  firstReviewAt: record.firstReviewAt,
  secondReviewAt: record.secondReviewAt,
  thirdReviewAt: record.thirdReviewAt,
  fourthReviewAt: record.fourthReviewAt,
  reviewTimezone: record.reviewTimezone,
  reviewPolicyVersion: record.reviewPolicyVersion,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt
});

const normalizeSearchText = (value: string): string => value.trim().toLowerCase();

const normalizeLabelList = (labels: string[]): string[] => normalizeCardLabels(labels);

const compareCardRecords = (left: CardRecord, right: CardRecord): number => {
  const createdAtDelta = right.createdAt.getTime() - left.createdAt.getTime();

  if (createdAtDelta !== 0) {
    return createdAtDelta;
  }

  return right.cardId.localeCompare(left.cardId);
};

const encodeCursor = (record: CardRecord): string => `${record.createdAt.toISOString()}::${record.cardId}`;

const decodeCursor = (cursor: string): { createdAt: number; cardId: string } | null => {
  const separatorIndex = cursor.indexOf("::");

  if (separatorIndex < 0) {
    return null;
  }

  const createdAt = Number(new Date(cursor.slice(0, separatorIndex)).getTime());
  const cardId = cursor.slice(separatorIndex + 2);

  if (!Number.isFinite(createdAt) || cardId.length === 0) {
    return null;
  }

  return { createdAt, cardId };
};

export const createPrismaCardStore = async (): Promise<CardRepositoryState> => {
  if (!process.env.DATABASE_URL) {
    return createCardStore();
  }

  const { prismaClient } = await import("../../lib/prisma.js");
  const records = await prismaClient.card.findMany();

  const cardsById = new Map<string, CardRecord>();
  const cardsByRequestId = new Map<string, CardRecord>();

  for (const record of records) {
    const card = mapCardRecord(record);
    cardsById.set(card.cardId, card);
    cardsByRequestId.set(card.requestId, card);
  }

  return {
    cardsById,
    cardsByRequestId,
    persistToDatabase: true,
    prismaClient
  };
};

const persistSnapshotToDatabase = async (snapshot: CardRepositoryState): Promise<void> => {
  if (!snapshot.persistToDatabase || !snapshot.prismaClient) {
    return;
  }

  await snapshot.prismaClient.$transaction(async (transaction: PrismaTransactionClientLike) => {
    await transaction.card.deleteMany({});

    for (const card of snapshot.cardsById.values()) {
      await transaction.card.upsert({
        where: { requestId: card.requestId },
        create: {
          id: card.cardId,
          requestId: card.requestId,
          userId: card.userId,
          title: card.title,
          question: card.question,
          answer: card.answer,
          memo: card.memo,
          labels: card.labels,
          firstReviewAt: card.firstReviewAt,
          secondReviewAt: card.secondReviewAt,
          thirdReviewAt: card.thirdReviewAt,
          fourthReviewAt: card.fourthReviewAt,
          reviewTimezone: card.reviewTimezone,
          reviewPolicyVersion: card.reviewPolicyVersion,
          createdAt: card.createdAt,
          updatedAt: card.updatedAt
        },
        update: {
          userId: card.userId,
          title: card.title,
          question: card.question,
          answer: card.answer,
          memo: card.memo,
          labels: card.labels,
          firstReviewAt: card.firstReviewAt,
          secondReviewAt: card.secondReviewAt,
          thirdReviewAt: card.thirdReviewAt,
          fourthReviewAt: card.fourthReviewAt,
          reviewTimezone: card.reviewTimezone,
          reviewPolicyVersion: card.reviewPolicyVersion,
          updatedAt: card.updatedAt
        }
      });
    }
  });
};

export class CardRepositoryError extends Error {
  constructor(public readonly code: "REQUEST_CONFLICT" | "PERSISTENCE_FAILED" | "CARD_NOT_FOUND" | "FORBIDDEN", message: string) {
    super(message);
    this.name = "CardRepositoryError";
  }
}

type CreateCardInput = {
  userId: string;
  requestId: string;
  draft: NormalizedCardDraft;
  reviewSchedule: ReviewSchedule;
  now: Date;
};

export class CardRepositoryTx {
  constructor(private readonly state: CardRepositoryState) {}

  async createCard(input: CreateCardInput): Promise<CardRecord> {
    const existingCard = this.state.cardsByRequestId.get(input.requestId);

    if (existingCard) {
      if (existingCard.userId !== input.userId) {
        throw new CardRepositoryError("REQUEST_CONFLICT", "このリクエストは別の利用者に紐づいています。");
      }

      return existingCard;
    }

    const card: CardRecord = {
      cardId: randomUUID(),
      requestId: input.requestId,
      userId: input.userId,
      title: input.draft.title,
      question: input.draft.question,
      answer: input.draft.answer,
      memo: input.draft.memo,
      labels: [...input.draft.labels],
      firstReviewAt: input.reviewSchedule.firstReviewAt,
      secondReviewAt: input.reviewSchedule.secondReviewAt,
      thirdReviewAt: input.reviewSchedule.thirdReviewAt,
      fourthReviewAt: input.reviewSchedule.fourthReviewAt,
      reviewTimezone: input.reviewSchedule.timezone,
      reviewPolicyVersion: input.reviewSchedule.policyVersion,
      createdAt: input.now,
      updatedAt: input.now
    };

    this.state.cardsById.set(card.cardId, card);
    this.state.cardsByRequestId.set(card.requestId, card);

    return card;
  }

  bulkAddLabels(input: { userId: string; cardIds: string[]; labels: string[] }): number {
    const normalizedCardIds = Array.from(new Set(input.cardIds.map((cardId) => cardId.trim()).filter((cardId) => cardId.length > 0)));
    const normalizedLabels = normalizeLabelList(input.labels);

    if (normalizedCardIds.length === 0 || normalizedLabels.length === 0) {
      return 0;
    }

    for (const cardId of normalizedCardIds) {
      const card = this.state.cardsById.get(cardId);

      if (!card) {
        throw new CardRepositoryError("CARD_NOT_FOUND", "対象のカードが見つかりません。");
      }

      if (card.userId !== input.userId) {
        throw new CardRepositoryError("FORBIDDEN", "他の利用者のカードは更新できません。");
      }

      card.labels = normalizeLabelList([...card.labels, ...normalizedLabels]);
      card.updatedAt = new Date();
      this.state.cardsById.set(card.cardId, card);
    }

    return normalizedCardIds.length;
  }

  deleteCard(input: { userId: string; cardId: string }): void {
    const card = this.state.cardsById.get(input.cardId);

    if (!card) {
      throw new CardRepositoryError("CARD_NOT_FOUND", "対象のカードが見つかりません。");
    }

    if (card.userId !== input.userId) {
      throw new CardRepositoryError("FORBIDDEN", "他の利用者のカードは削除できません。");
    }

    this.state.cardsById.delete(card.cardId);
    this.state.cardsByRequestId.delete(card.requestId);
  }
}

export class CardRepository {
  constructor(private readonly store: CardRepositoryState = createCardStore()) {}

  getCardCount(): number {
    return this.store.cardsById.size;
  }

  getCardByRequestId(requestId: string): CardRecord | undefined {
    return this.store.cardsByRequestId.get(requestId);
  }

  getCardById(cardId: string): CardRecord | undefined {
    return this.store.cardsById.get(cardId);
  }

  listCards(query: CardListQuery): { items: ReturnType<typeof mapCardRecordToListItem>[]; nextCursor: string | null } {
    const search = query.search ? normalizeSearchText(query.search) : "";
    const labels = normalizeLabelList(query.labels ?? []);
    const limit = Math.min(Math.max(Math.trunc(query.limit ?? 20), 1), 100);

    const matchingCards = this.filterCards(query.userId, search, labels).sort(compareCardRecords);

    let startIndex = 0;
    if (query.cursor) {
      const decodedCursor = decodeCursor(query.cursor);
      if (decodedCursor) {
        const cursorIndex = matchingCards.findIndex((card) => card.createdAt.getTime() === decodedCursor.createdAt && card.cardId === decodedCursor.cardId);
        startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
      }
    }

    const pagedCards = matchingCards.slice(startIndex, startIndex + limit);
    const nextCursor = startIndex + limit < matchingCards.length && pagedCards.length > 0 ? encodeCursor(pagedCards[pagedCards.length - 1]) : null;

    return {
      items: pagedCards.map((card) => mapCardRecordToListItem(card)),
      nextCursor
    };
  }

  listAllCards(query: Pick<CardListQuery, "userId" | "search" | "labels">): ReturnType<typeof mapCardRecordToListItem>[] {
    const search = query.search ? normalizeSearchText(query.search) : "";
    const labels = normalizeLabelList(query.labels ?? []);

    return this.filterCards(query.userId, search, labels).sort(compareCardRecords).map((card) => mapCardRecordToListItem(card));
  }

  private filterCards(userId: string, search: string, labels: string[]): CardRecord[] {
    return Array.from(this.store.cardsById.values())
      .filter((card) => card.userId === userId)
      .filter((card) => {
        if (search.length === 0) {
          return true;
        }

        const searchableText = [card.title, card.question, card.answer ?? "", card.memo ?? ""].join(" ").toLowerCase();
        return searchableText.includes(search);
      })
      .filter((card) => labels.every((label) => card.labels.includes(label)));
  }

  async withTransaction<T>(operation: (tx: CardRepositoryTx) => Promise<T>): Promise<T> {
    const snapshot = cloneCardStore(this.store);
    const tx = new CardRepositoryTx(snapshot);
    const result = await operation(tx);

    try {
      await persistSnapshotToDatabase(snapshot);
    } catch (error) {
      throw new CardRepositoryError("PERSISTENCE_FAILED", error instanceof Error ? error.message : "カード保存に失敗しました。");
    }

    this.store.cardsById = snapshot.cardsById;
    this.store.cardsByRequestId = snapshot.cardsByRequestId;
    this.store.persistToDatabase = snapshot.persistToDatabase;
    this.store.prismaClient = snapshot.prismaClient;

    return result;
  }
}