/*
  Warnings:

  - Made the column `images` on table `Challenges` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Challenges" ALTER COLUMN "images" SET NOT NULL;
