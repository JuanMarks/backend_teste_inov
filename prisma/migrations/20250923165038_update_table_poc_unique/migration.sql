/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Poc` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Poc_id_key" ON "public"."Poc"("id");
