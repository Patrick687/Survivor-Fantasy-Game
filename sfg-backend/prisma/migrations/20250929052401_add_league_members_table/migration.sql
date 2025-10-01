-- CreateEnum
CREATE TYPE "sfg"."LeagueMemberRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "sfg"."LeagueMember" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "sfg"."LeagueMemberRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeagueMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeagueMember_leagueId_idx" ON "sfg"."LeagueMember"("leagueId");

-- CreateIndex
CREATE INDEX "LeagueMember_userId_idx" ON "sfg"."LeagueMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueMember_leagueId_userId_key" ON "sfg"."LeagueMember"("leagueId", "userId");

-- AddForeignKey
ALTER TABLE "sfg"."LeagueMember" ADD CONSTRAINT "LeagueMember_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "sfg"."League"("leagueId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sfg"."LeagueMember" ADD CONSTRAINT "LeagueMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sfg"."User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
