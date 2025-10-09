import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ChallengeController } from "./challenge.controller";
import { ChallengeService } from "./challenge.service";
import { ComumGuard } from "src/auth/comum-auth.guard";
import { AvaliadorGuard } from "src/auth/avaliador-auth.guard";
import { AdminGuard } from "src/auth/admin.guard";
import { RolesOrGuard } from "src/auth/rolesOrGuard.guard";
import { GestorGuard } from "src/auth/gestor-auth.guard";

@Module({
    imports: [PrismaModule],
    controllers: [ChallengeController],
    providers: [ChallengeService, ComumGuard, AvaliadorGuard, GestorGuard, AdminGuard, RolesOrGuard],
    exports: [ChallengeService]
})

export class ChallengeModule {}