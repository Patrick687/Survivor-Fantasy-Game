-- CreateTable
CREATE TABLE "sfg"."League" (
    "leagueId" TEXT NOT NULL,
    "leagueName" TEXT NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("leagueId")
);

-- CreateIndex
CREATE INDEX "League_seasonId_idx" ON "sfg"."League"("seasonId");

-- CreateIndex
CREATE INDEX "League_createdById_idx" ON "sfg"."League"("createdById");

-- AddForeignKey
ALTER TABLE "sfg"."League" ADD CONSTRAINT "League_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "sfg"."Season"("seasonId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sfg"."League" ADD CONSTRAINT "League_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "sfg"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
