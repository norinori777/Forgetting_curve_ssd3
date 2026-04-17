import { randomUUID } from "node:crypto";
import type { UserAccount, UserSession } from "../../domains/auth/SignupModels.js";
import { cloneAuthStore, commitAuthStore, createAuthStore, type AuthStoreState } from "./authStore.js";

type CreateSessionInput = {
  userId: string;
  issuedAt: Date;
  ttlSeconds: number;
  sessionId?: string;
};

type TransactionState = AuthStoreState;

export class LoginRepository {
  constructor(private readonly store: AuthStoreState = createAuthStore()) {}

  getSessionCount(): number {
    return this.store.sessionsById.size;
  }

  async findUserByEmail(normalizedEmail: string): Promise<UserAccount | undefined> {
    return this.store.usersByEmail.get(normalizedEmail);
  }

  async withTransaction<T>(operation: (tx: LoginRepositoryTx) => Promise<T>): Promise<T> {
    const snapshot = cloneAuthStore(this.store);
    const tx = new LoginRepositoryTx(snapshot);
    const result = await operation(tx);
    await commitAuthStore(this.store, snapshot);
    return result;
  }
}

export class LoginRepositoryTx {
  constructor(private readonly state: TransactionState) {}

  async createSession(input: CreateSessionInput): Promise<UserSession> {
    const session: UserSession = {
      sessionId: input.sessionId ?? randomUUID(),
      userId: input.userId,
      issuedAt: input.issuedAt,
      expiresAt: new Date(input.issuedAt.getTime() + input.ttlSeconds * 1000),
      state: "active"
    };

    this.state.sessionsById.set(session.sessionId, session);
    return session;
  }
}