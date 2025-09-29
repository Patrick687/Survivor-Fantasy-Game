-- CreateTable
CREATE TABLE "sfg"."Season" (
    "seasonId" INTEGER NOT NULL,
    "filmingLocation" TEXT,
    "airStartDate" TIMESTAMP(3),
    "airEndDate" TIMESTAMP(3),

    CONSTRAINT "Season_pkey" PRIMARY KEY ("seasonId")
);
