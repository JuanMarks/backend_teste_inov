-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'COMUM', 'AVALIADOR', 'GESTOR');

-- CreateEnum
CREATE TYPE "public"."TypePublication" AS ENUM ('PUBLICO', 'RESTRITO');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ATIVO', 'INATIVO', 'PENDENTE');

-- CreateEnum
CREATE TYPE "public"."Stage" AS ENUM ('GERACAO', 'PRE_TRIAGEM', 'IDEACAO', 'TRIAGEM_DETALHADA', 'EXPERIMENTACAO');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('ALTA', 'MEDIA', 'BAIXA');

-- CreateEnum
CREATE TYPE "public"."StageStartup" AS ENUM ('IDEACAO', 'OPERACAO', 'TRACAO', 'ESCALA');

-- CreateEnum
CREATE TYPE "public"."StatusConnectios" AS ENUM ('INTERESSE', 'PENDENTE', 'NAO_INTERESSE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "companyId" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Challenges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "area" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "public"."TypePublication" NOT NULL,
    "companyId" TEXT,
    "status" "public"."Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Idea" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stage" "public"."Stage" NOT NULL,
    "priority" "public"."Priority" NOT NULL,
    "votes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comments" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "evaluationsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Evaluations" (
    "id" TEXT NOT NULL,
    "stage" "public"."Stage" NOT NULL DEFAULT 'PRE_TRIAGEM',
    "ideaId" TEXT NOT NULL,
    "evaluatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ModelCriteria" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL,
    "evaluationsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModelCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Startup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "segment" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "technology" TEXT NOT NULL,
    "stage" "public"."StageStartup" NOT NULL,
    "location" TEXT NOT NULL,
    "founders" TEXT NOT NULL,
    "pitch" TEXT NOT NULL,
    "links" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Startup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Connections" (
    "id" TEXT NOT NULL,
    "status" "public"."StatusConnectios" NOT NULL,
    "challengeId" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."History" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "action" TEXT NOT NULL,
    "connectionsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Companies_name_key" ON "public"."Companies"("name");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Challenges" ADD CONSTRAINT "Challenges_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Idea" ADD CONSTRAINT "Idea_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Idea" ADD CONSTRAINT "Idea_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Idea" ADD CONSTRAINT "Idea_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "public"."Challenges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "public"."Idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_evaluationsId_fkey" FOREIGN KEY ("evaluationsId") REFERENCES "public"."Evaluations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evaluations" ADD CONSTRAINT "Evaluations_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "public"."Idea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Evaluations" ADD CONSTRAINT "Evaluations_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModelCriteria" ADD CONSTRAINT "ModelCriteria_evaluationsId_fkey" FOREIGN KEY ("evaluationsId") REFERENCES "public"."Evaluations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connections" ADD CONSTRAINT "Connections_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "public"."Challenges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connections" ADD CONSTRAINT "Connections_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "public"."Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connections" ADD CONSTRAINT "Connections_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."History" ADD CONSTRAINT "History_connectionsId_fkey" FOREIGN KEY ("connectionsId") REFERENCES "public"."Connections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
