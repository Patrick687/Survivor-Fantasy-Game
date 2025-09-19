/*
  Warnings:

  - A unique constraint covering the columns `[leagueId,userId]` on the table `LeagueMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LeagueMember_leagueId_userId_key" ON "public"."LeagueMember"("leagueId", "userId");
