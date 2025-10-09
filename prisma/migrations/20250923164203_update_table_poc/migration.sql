-- DropForeignKey
ALTER TABLE "public"."Poc" DROP CONSTRAINT "Poc_challengesId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Poc" DROP CONSTRAINT "Poc_startupId_fkey";

-- AlterTable
ALTER TABLE "public"."Poc" ALTER COLUMN "challengesId" DROP NOT NULL,
ALTER COLUMN "startupId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Poc" ADD CONSTRAINT "Poc_challengesId_fkey" FOREIGN KEY ("challengesId") REFERENCES "public"."Challenges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Poc" ADD CONSTRAINT "Poc_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "public"."Startup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
