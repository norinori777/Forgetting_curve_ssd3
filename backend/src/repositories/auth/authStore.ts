import type { UserAccount, UserSession } from "../../domains/auth/SignupModels.js";

export type AuthStoreState = {
  usersById: Map<string, UserAccount>;
  usersByEmail: Map<string, UserAccount>;
  sessionsById: Map<string, UserSession>;
};

export const createAuthStore = (): AuthStoreState => ({
  usersById: new Map<string, UserAccount>(),
  usersByEmail: new Map<string, UserAccount>(),
  sessionsById: new Map<string, UserSession>()
});

export const cloneAuthStore = (source: AuthStoreState): AuthStoreState => ({
  usersById: new Map(source.usersById),
  usersByEmail: new Map(source.usersByEmail),
  sessionsById: new Map(source.sessionsById)
});

export const commitAuthStore = (target: AuthStoreState, snapshot: AuthStoreState): void => {
  target.usersById = snapshot.usersById;
  target.usersByEmail = snapshot.usersByEmail;
  target.sessionsById = snapshot.sessionsById;
};