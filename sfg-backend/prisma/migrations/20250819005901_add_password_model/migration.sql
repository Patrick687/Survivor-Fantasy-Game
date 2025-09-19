-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "password";

-- CreateTable
CREATE TABLE "public"."Password" (
    "userId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("userId")
);
