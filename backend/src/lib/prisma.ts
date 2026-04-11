import "dotenv/config";
import { PrismaClient } from "@prisma/client/index";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to initialize PrismaClient.");
}

declare global {
  var prismaClient: PrismaClient | undefined;
}

const prismaAdapter = new PrismaPg(databaseUrl, { schema: "public" });

export const prismaClient = globalThis.prismaClient ?? new PrismaClient({
  adapter: prismaAdapter
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaClient = prismaClient;
}