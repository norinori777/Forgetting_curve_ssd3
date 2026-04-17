import { randomUUID } from "node:crypto";
import type { CardRecord, NormalizedCardDraft, ReviewSchedule } from "../../domains/cards/CardModels.js";
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
  constructor(public readonly code: "REQUEST_CONFLICT" | "PERSISTENCE_FAILED", message: string) {
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
}

export class CardRepository {
  constructor(private readonly store: CardRepositoryState = createCardStore()) {}

  getCardCount(): number {
    return this.store.cardsById.size;
  }

  getCardByRequestId(requestId: string): CardRecord | undefined {
    return this.store.cardsByRequestId.get(requestId);
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