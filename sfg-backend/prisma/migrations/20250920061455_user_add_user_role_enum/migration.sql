-- CreateEnum
CREATE TYPE "sfg"."UserRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "sfg"."User" ADD COLUMN     "role" "sfg"."UserRole" NOT NULL DEFAULT 'USER';
