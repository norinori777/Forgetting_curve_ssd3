import "dotenv/config";
import * as PrismaClientModule from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to initialize PrismaClient.");
}

const prismaAdapter = new PrismaPg(databaseUrl, { schema: "public" });

export type PrismaTransactionClientLike = {
  user: {
    upsert: (args: unknown) => Promise<unknown>;
  };
  session: {
    upsert: (args: unknown) => Promise<unknown>;
  };
  card: {
    upsert: (args: unknown) => Promise<unknown>;
    deleteMany: (args: unknown) => Promise<unknown>;
  };
};

export type PrismaUserRecord = {
  id: string;
  normalizedEmail: string;
  passwordHash: string;
  createdAt: Date;
  status: string;
};

export type PrismaSessionRecord = {
  id: string;
  userId: string;
  issuedAt: Date;
  expiresAt: Date;
  state: string;
};

export type PrismaCardRecord = {
  id: string;
  requestId: string;
  userId: string;
  title: string;
  question: string;
  answer: string | null;
  memo: string | null;
  labels: string[];
  firstReviewAt: Date;
  secondReviewAt: Date;
  thirdReviewAt: Date;
  fourthReviewAt: Date;
  reviewTimezone: string;
  reviewPolicyVersion: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PrismaClientLike = {
  user: {
    findMany: () => Promise<PrismaUserRecord[]>;
  };
  session: {
    findMany: () => Promise<PrismaSessionRecord[]>;
  };
  card: {
    findMany: () => Promise<PrismaCardRecord[]>;
    deleteMany: (args: unknown) => Promise<unknown>;
  };
  $transaction: <T>(operation: (transaction: PrismaTransactionClientLike) => Promise<T>) => Promise<T>;
};

declare global {
  var prismaClient: PrismaClientLike | undefined;
}

const PrismaClientCtor = (PrismaClientModule as unknown as { PrismaClient: new (options: { adapter: typeof prismaAdapter }) => PrismaClientLike }).PrismaClient;

export const prismaClient = globalThis.prismaClient ?? new PrismaClientCtor({
  adapter: prismaAdapter
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaClient = prismaClient;
}