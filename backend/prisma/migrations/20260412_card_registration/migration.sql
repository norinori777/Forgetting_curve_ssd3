-- CreateTable
CREATE TABLE "Card" (
    "id" UUID NOT NULL,
    "requestId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "memo" TEXT,
    "labels" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "firstReviewAt" TIMESTAMP(3) NOT NULL,
    "secondReviewAt" TIMESTAMP(3) NOT NULL,
    "thirdReviewAt" TIMESTAMP(3) NOT NULL,
    "fourthReviewAt" TIMESTAMP(3) NOT NULL,
    "reviewTimezone" TEXT NOT NULL,
    "reviewPolicyVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_requestId_key" ON "Card"("requestId");

-- CreateIndex
CREATE INDEX "Card_userId_idx" ON "Card"("userId");

-- CreateIndex
CREATE INDEX "Card_requestId_idx" ON "Card"("requestId");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;