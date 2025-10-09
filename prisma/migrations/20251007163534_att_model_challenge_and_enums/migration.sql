/*
  Warnings:

  - Added the required column `categoria` to the `Challenges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `Challenges` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Tags" AS ENUM ('IA', 'SUSTENTABILIDADE', 'FINTECH', 'HEALTHTECH', 'EDTECH', 'IOT', 'BLOCKHAIN', 'AUTOMACAO');

-- CreateEnum
CREATE TYPE "public"."CategoriaChallenges" AS ENUM ('AMBIENTAL', 'TECNOLOGIA', 'SUSTENTAVEL', 'FINANCEIRO', 'OPERACIONAL', 'COMERCIAL', 'SAUDE', 'SOCIAL', 'EDUCACIONAL', 'LOGISTICO', 'CULTURAL');

-- AlterTable
ALTER TABLE "public"."Challenges" ADD COLUMN     "categoria" "public"."CategoriaChallenges" NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "tags" "public"."Tags" NOT NULL;
