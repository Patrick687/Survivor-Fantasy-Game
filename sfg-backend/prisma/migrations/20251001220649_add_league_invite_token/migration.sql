-- CreateTable
CREATE TABLE "sfg"."LeagueInviteToken" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeagueInviteToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeagueInviteToken_token_key" ON "sfg"."LeagueInviteToken"("token");

-- CreateIndex
CREATE INDEX "LeagueInviteToken_leagueId_idx" ON "sfg"."LeagueInviteToken"("leagueId");

-- CreateIndex
CREATE INDEX "LeagueInviteToken_token_idx" ON "sfg"."LeagueInviteToken"("token");

-- CreateIndex
CREATE INDEX "LeagueInviteToken_createdBy_idx" ON "sfg"."LeagueInviteToken"("createdBy");

-- AddForeignKey
ALTER TABLE "sfg"."LeagueInviteToken" ADD CONSTRAINT "LeagueInviteToken_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "sfg"."League"("leagueId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sfg"."LeagueInviteToken" ADD CONSTRAINT "LeagueInviteToken_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "sfg"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
