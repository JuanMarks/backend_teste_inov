-- CreateTable
CREATE TABLE "public"."Poc" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targets" TEXT NOT NULL,
    "deadlines" TEXT NOT NULL,
    "indicators" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "challengesId" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Poc_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Poc" ADD CONSTRAINT "Poc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Poc" ADD CONSTRAINT "Poc_challengesId_fkey" FOREIGN KEY ("challengesId") REFERENCES "public"."Challenges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Poc" ADD CONSTRAINT "Poc_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "public"."Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
