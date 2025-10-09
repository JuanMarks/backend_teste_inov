/*
  Warnings:

  - Added the required column `stage` to the `Challenges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Challenges" ADD COLUMN     "stage" "public"."Stage" NOT NULL;
