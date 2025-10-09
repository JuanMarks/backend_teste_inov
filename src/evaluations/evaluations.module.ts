import { Module } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [EvaluationsController],
  providers: [EvaluationsService, PrismaService],
})
export class EvaluationsModule {}
