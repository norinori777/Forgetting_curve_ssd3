CREATE TABLE IF NOT EXISTS "User" (
  "id" UUID PRIMARY KEY,
  "normalizedEmail" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Session" (
  "id" UUID PRIMARY KEY,
  "userId" UUID NOT NULL,
  "issuedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "expiresAt" TIMESTAMP NOT NULL,
  "state" TEXT NOT NULL DEFAULT 'active',
  CONSTRAINT "Session_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "User" ("id")
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session" ("userId");
CREATE INDEX IF NOT EXISTS "Session_expiresAt_idx" ON "Session" ("expiresAt");
