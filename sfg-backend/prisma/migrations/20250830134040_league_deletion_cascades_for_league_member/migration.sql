-- DropForeignKey
ALTER TABLE "public"."LeagueMember" DROP CONSTRAINT "LeagueMember_leagueId_fkey";

-- AddForeignKey
ALTER TABLE "public"."LeagueMember" ADD CONSTRAINT "LeagueMember_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
