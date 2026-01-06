/*
  Warnings:

  - A unique constraint covering the columns `[leagueId,createdById]` on the table `LeagueInviteCode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LeagueInviteCode_leagueId_createdById_key" ON "LeagueInviteCode"("leagueId", "createdById");
