-- CreateEnum
CREATE TYPE "public"."StatusInvit" AS ENUM ('PENDENTE', 'COMPLETO', 'CANCELADO', 'EXPIRADO');

-- CreateTable
CREATE TABLE "public"."Invitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "companyId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" "public"."StatusInvit" NOT NULL DEFAULT 'PENDENTE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Invitation_tokenHash_idx" ON "public"."Invitation"("tokenHash");

-- CreateIndex
CREATE INDEX "Invitation_email_idx" ON "public"."Invitation"("email");
