/*
  Warnings:

  - A unique constraint covering the columns `[firstName,lastName]` on the table `Survivor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Survivor_firstName_lastName_key" ON "sfg"."Survivor"("firstName", "lastName");
