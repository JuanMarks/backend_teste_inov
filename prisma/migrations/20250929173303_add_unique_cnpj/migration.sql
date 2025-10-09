/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Startup` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "avatar" DROP NOT NULL,
ALTER COLUMN "avatar" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Startup_cnpj_key" ON "public"."Startup"("cnpj");
