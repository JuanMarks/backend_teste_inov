/*
  Warnings:

  - You are about to drop the column `ideaId` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the column `timeStamp` on the `Comments` table. All the data in the column will be lost.
  - Added the required column `commentableId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commentableType` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CommentableType" AS ENUM ('IDEA', 'PROJECT', 'CHALLENGE', 'COMPANY');

-- DropForeignKey
ALTER TABLE "public"."Comments" DROP CONSTRAINT "Comments_evaluationsId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comments" DROP CONSTRAINT "Comments_ideaId_fkey";

-- AlterTable
ALTER TABLE "public"."Comments" DROP COLUMN "ideaId",
DROP COLUMN "timeStamp",
ADD COLUMN     "commentableId" TEXT NOT NULL,
ADD COLUMN     "commentableType" "public"."CommentableType" NOT NULL,
ALTER COLUMN "evaluationsId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_evaluationsId_fkey" FOREIGN KEY ("evaluationsId") REFERENCES "public"."Evaluations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
