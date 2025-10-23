-- CreateTable
CREATE TABLE "sfg"."Episode" (
    "seasonId" INTEGER NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'TBD',
    "airDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "Episode_seasonId_idx" ON "sfg"."Episode"("seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_seasonId_episodeNumber_key" ON "sfg"."Episode"("seasonId", "episodeNumber");

-- AddForeignKey
ALTER TABLE "sfg"."Episode" ADD CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "sfg"."Season"("seasonId") ON DELETE CASCADE ON UPDATE CASCADE;
