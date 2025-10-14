import { Module } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { GuardsModule } from 'src/auth/guards.module';
import { AvaliadorGuard } from 'src/auth/avaliador-auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [PrismaModule, GuardsModule],
  controllers: [EvaluationsController],
  providers: [EvaluationsService, PrismaService, AvaliadorGuard, JwtAuthGuard],
})
export class EvaluationsModule {}
