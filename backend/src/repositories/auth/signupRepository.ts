import { randomUUID } from "node:crypto";
import type { UserAccount, UserSession } from "../../domains/auth/SignupModels.js";

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

type TransactionState = {
  usersById: Map<string, UserAccount>;
  usersByEmail: Map<string, UserAccount>;
  sessionsById: Map<string, UserSession>;
};

export class SignupRepository {
  private usersById = new Map<string, UserAccount>();

  private usersByEmail = new Map<string, UserAccount>();

  private sessionsById = new Map<string, UserSession>();

  async isDuplicateEmail(normalizedEmail: string): Promise<boolean> {
    return this.usersByEmail.has(normalizedEmail);
  }

  async withTransaction<T>(operation: (tx: SignupRepositoryTx) => Promise<T>): Promise<T> {
    const snapshot: TransactionState = {
      usersById: new Map(this.usersById),
      usersByEmail: new Map(this.usersByEmail),
      sessionsById: new Map(this.sessionsById)
    };

    const tx = new SignupRepositoryTx(snapshot);
    const result = await operation(tx);

    this.usersById = snapshot.usersById;
    this.usersByEmail = snapshot.usersByEmail;
    this.sessionsById = snapshot.sessionsById;

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
