import type { PrismaClientLike, PrismaSessionRecord, PrismaTransactionClientLike, PrismaUserRecord } from "../../lib/prisma.js";
import type { UserAccount, UserSession } from "../../domains/auth/SignupModels.js";

export type AuthStoreState = {
  usersById: Map<string, UserAccount>;
  usersByEmail: Map<string, UserAccount>;
  sessionsById: Map<string, UserSession>;
  persistToDatabase: boolean;
  prismaClient?: PrismaClientLike;
};

export const createAuthStore = (): AuthStoreState => ({
  usersById: new Map<string, UserAccount>(),
  usersByEmail: new Map<string, UserAccount>(),
  sessionsById: new Map<string, UserSession>(),
  persistToDatabase: false
});

export const cloneAuthStore = (source: AuthStoreState): AuthStoreState => ({
  usersById: new Map(source.usersById),
  usersByEmail: new Map(source.usersByEmail),
  sessionsById: new Map(source.sessionsById),
  persistToDatabase: source.persistToDatabase,
  prismaClient: source.prismaClient
});

const mapUserRecord = (record: PrismaUserRecord): UserAccount => ({
  userId: record.id,
  normalizedEmail: record.normalizedEmail,
  passwordHash: record.passwordHash,
  createdAt: record.createdAt,
  status: record.status === "locked" ? "locked" : "active"
});

const mapSessionRecord = (record: PrismaSessionRecord): UserSession => ({
  sessionId: record.id,
  userId: record.userId,
  issuedAt: record.issuedAt,
  expiresAt: record.expiresAt,
  state: record.state === "expired" ? "expired" : record.state === "revoked" ? "revoked" : "active"
});

export const createPrismaAuthStore = async (): Promise<AuthStoreState> => {
  const { prismaClient } = await import("../../lib/prisma.js");
  const [userRecords, sessionRecords] = await Promise.all([
    prismaClient.user.findMany(),
    prismaClient.session.findMany()
  ]);

  const usersById = new Map<string, UserAccount>();
  const usersByEmail = new Map<string, UserAccount>();
  const sessionsById = new Map<string, UserSession>();

  for (const record of userRecords) {
    const user = mapUserRecord(record);
    usersById.set(user.userId, user);
    usersByEmail.set(user.normalizedEmail, user);
  }

  for (const record of sessionRecords) {
    const session = mapSessionRecord(record);
    sessionsById.set(session.sessionId, session);
  }

  return {
    usersById,
    usersByEmail,
    sessionsById,
    persistToDatabase: true,
    prismaClient
  };
};

const persistSnapshotToDatabase = async (snapshot: AuthStoreState): Promise<void> => {
  if (!snapshot.persistToDatabase || !snapshot.prismaClient) {
    return;
  }

  await snapshot.prismaClient.$transaction(async (transaction: PrismaTransactionClientLike) => {
    for (const user of snapshot.usersById.values()) {
      await transaction.user.upsert({
        where: { normalizedEmail: user.normalizedEmail },
        create: {
          id: user.userId,
          normalizedEmail: user.normalizedEmail,
          passwordHash: user.passwordHash,
          status: user.status,
          createdAt: user.createdAt
        },
        update: {
          passwordHash: user.passwordHash,
          status: user.status
        }
      });
    }

    for (const session of snapshot.sessionsById.values()) {
      await transaction.session.upsert({
        where: { id: session.sessionId },
        create: {
          id: session.sessionId,
          userId: session.userId,
          issuedAt: session.issuedAt,
          expiresAt: session.expiresAt,
          state: session.state
        },
        update: {
          userId: session.userId,
          issuedAt: session.issuedAt,
          expiresAt: session.expiresAt,
          state: session.state
        }
      });
    }
  });
};

export const commitAuthStore = async (target: AuthStoreState, snapshot: AuthStoreState): Promise<void> => {
  await persistSnapshotToDatabase(snapshot);

  target.usersById = snapshot.usersById;
  target.usersByEmail = snapshot.usersByEmail;
  target.sessionsById = snapshot.sessionsById;
  target.persistToDatabase = snapshot.persistToDatabase;
  target.prismaClient = snapshot.prismaClient;
};