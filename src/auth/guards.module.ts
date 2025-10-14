import { Module } from '@nestjs/common';
import { ComumGuard } from './comum-auth.guard';
import { AvaliadorGuard } from './avaliador-auth.guard';
import { GestorGuard } from './gestor-auth.guard';
import { RolesOrGuard } from './rolesOrGuard.guard';
import { AdminGuard } from './admin.guard';

@Module({
  providers: [ComumGuard, AvaliadorGuard, GestorGuard, RolesOrGuard, AdminGuard],
  exports: [ComumGuard, AvaliadorGuard, GestorGuard, RolesOrGuard, AdminGuard],
})
export class GuardsModule {}