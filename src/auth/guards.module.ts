import { Module } from '@nestjs/common';
import { ComumGuard } from './comum-auth.guard';
import { AvaliadorGuard } from './avaliador-auth.guard';
import { GestorGuard } from './gestor-auth.guard';
import { RolesOrGuard } from './rolesOrGuard.guard';

@Module({
  providers: [ComumGuard, AvaliadorGuard, GestorGuard, RolesOrGuard],
  exports: [ComumGuard, AvaliadorGuard, GestorGuard, RolesOrGuard],
})
export class GuardsModule {}