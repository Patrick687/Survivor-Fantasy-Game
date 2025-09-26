-- CreateTable
CREATE TABLE "sfg"."Token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "sfg"."Token"("token");

-- CreateIndex
CREATE INDEX "Token_userId_idx" ON "sfg"."Token"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_userId_seq_key" ON "sfg"."Token"("userId", "seq");

-- AddForeignKey
ALTER TABLE "sfg"."Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sfg"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
