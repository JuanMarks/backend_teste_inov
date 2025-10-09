-- AlterTable
ALTER TABLE "public"."Challenges" ALTER COLUMN "images" DROP NOT NULL,
ALTER COLUMN "images" SET DATA TYPE TEXT;
