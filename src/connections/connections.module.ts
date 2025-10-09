import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ConnectionsController } from "./connections.controller";
import { ConnectionsService } from "./connections.service";
import { RolesOrGuard } from "src/auth/rolesOrGuard.guard";
import { GestorGuard } from "src/auth/gestor-auth.guard";
import { AvaliadorGuard } from "src/auth/avaliador-auth.guard";
import { ComumGuard } from "src/auth/comum-auth.guard";

@Module({
    imports: [PrismaModule],
    providers: [ConnectionsService, RolesOrGuard, GestorGuard, AvaliadorGuard, ComumGuard],
    controllers: [ConnectionsController],
    exports: [ConnectionsService]
})

export class ConnectionsModule {}