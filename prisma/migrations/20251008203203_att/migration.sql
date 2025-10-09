/*
  Warnings:

  - The values [PROJECT,COMPANY] on the enum `CommentableType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."CommentableType_new" AS ENUM ('IDEA', 'CHALLENGE');
ALTER TABLE "public"."Comments" ALTER COLUMN "commentableType" TYPE "public"."CommentableType_new" USING ("commentableType"::text::"public"."CommentableType_new");
ALTER TYPE "public"."CommentableType" RENAME TO "CommentableType_old";
ALTER TYPE "public"."CommentableType_new" RENAME TO "CommentableType";
DROP TYPE "public"."CommentableType_old";
COMMIT;
