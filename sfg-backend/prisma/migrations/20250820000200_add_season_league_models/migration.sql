-- CreateTable
CREATE TABLE "public"."Season" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."League" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Password" ADD CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."League" ADD CONSTRAINT "League_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "public"."Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Survivor Season 48 info (Spring 2025, typical schedule)
INSERT INTO "public"."Season" ("id", "name", "startDate", "endDate")
VALUES (
    '48', -- or use a UUID if your schema expects it
    'Survivor 48: Fiji',
    '2025-02-28', -- Estimated premiere date
    '2025-05-22'  -- Estimated finale date
);

-- Example leagues for Season 48
INSERT INTO "public"."League" ("id", "name", "seasonId")
VALUES
    ('league1', 'Friends League', '48'),
    ('league2', 'Office Pool', '48'),
    ('league3', 'Family Showdown', '48');