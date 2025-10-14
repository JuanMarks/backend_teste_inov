import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { POCController } from "./poc.controller";
import { POCService } from "./poc.service";
import { ComumGuard } from "src/auth/comum-auth.guard";
import { AvaliadorGuard } from "src/auth/avaliador-auth.guard";
import { GestorGuard } from "src/auth/gestor-auth.guard";
import { RolesOrGuard } from "src/auth/rolesOrGuard.guard";
import { AdminGuard } from "src/auth/admin.guard";

@Module({
    imports: [PrismaModule],
    controllers: [POCController],
    providers: [
        POCService,
        ComumGuard,
        AvaliadorGuard,
        GestorGuard,
        RolesOrGuard,
        AdminGuard
    ]
})
export class POCModule {}