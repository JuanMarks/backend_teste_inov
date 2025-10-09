/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cnpj` to the `Companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Companies" ADD COLUMN     "cnpj" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Companies_cnpj_key" ON "public"."Companies"("cnpj");
