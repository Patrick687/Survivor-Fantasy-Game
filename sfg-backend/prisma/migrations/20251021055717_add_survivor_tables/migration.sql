-- CreateTable
CREATE TABLE "sfg"."Survivor" (
    "survivorId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "nickName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Survivor_pkey" PRIMARY KEY ("survivorId")
);

-- CreateTable
CREATE TABLE "sfg"."SeasonSurvivor" (
    "survivorId" TEXT NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "hometown" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "SeasonSurvivor_survivorId_idx" ON "sfg"."SeasonSurvivor"("survivorId");

-- CreateIndex
CREATE INDEX "SeasonSurvivor_seasonId_idx" ON "sfg"."SeasonSurvivor"("seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "SeasonSurvivor_survivorId_seasonId_key" ON "sfg"."SeasonSurvivor"("survivorId", "seasonId");

-- AddForeignKey
ALTER TABLE "sfg"."SeasonSurvivor" ADD CONSTRAINT "SeasonSurvivor_survivorId_fkey" FOREIGN KEY ("survivorId") REFERENCES "sfg"."Survivor"("survivorId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sfg"."SeasonSurvivor" ADD CONSTRAINT "SeasonSurvivor_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "sfg"."Season"("seasonId") ON DELETE CASCADE ON UPDATE CASCADE;
