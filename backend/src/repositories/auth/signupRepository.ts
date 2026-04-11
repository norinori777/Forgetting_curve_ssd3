import { randomUUID } from "node:crypto";
import type { UserAccount, UserSession } from "../../domains/auth/SignupModels.js";
import { cloneAuthStore, commitAuthStore, createAuthStore, type AuthStoreState } from "./authStore.js";

type CreateUserInput = {
  normalizedEmail: string;
  passwordHash: string;
  now: Date;
};

type CreateSessionInput = {
  userId: string;
  issuedAt: Date;
  ttlSeconds: number;
};

type TransactionState = AuthStoreState;

export class SignupRepository {
  constructor(private readonly store: AuthStoreState = createAuthStore()) {}

  getSessionCount(): number {
    return this.store.sessionsById.size;
  }

  async isDuplicateEmail(normalizedEmail: string): Promise<boolean> {
    return this.store.usersByEmail.has(normalizedEmail);
  }

  async withTransaction<T>(operation: (tx: SignupRepositoryTx) => Promise<T>): Promise<T> {
    const snapshot = cloneAuthStore(this.store);

    const tx = new SignupRepositoryTx(snapshot);
    const result = await operation(tx);

    await commitAuthStore(this.store, snapshot);

    return result;
  }
}

export class SignupRepositoryTx {
  constructor(private readonly state: TransactionState) {}

  async createUser(input: CreateUserInput): Promise<UserAccount> {
    const user: UserAccount = {
      userId: randomUUID(),
      normalizedEmail: input.normalizedEmail,
      passwordHash: input.passwordHash,
      createdAt: input.now,
      status: "active"
    };

    this.state.usersById.set(user.userId, user);
    this.state.usersByEmail.set(user.normalizedEmail, user);

    return user;
  }

  async createSession(input: CreateSessionInput): Promise<UserSession> {
    const session: UserSession = {
      sessionId: randomUUID(),
      userId: input.userId,
      issuedAt: input.issuedAt,
      expiresAt: new Date(input.issuedAt.getTime() + input.ttlSeconds * 1000),
      state: "active"
    };

    this.state.sessionsById.set(session.sessionId, session);
    return session;
  }
}
