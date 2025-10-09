import { Module } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaController } from './idea.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { GuardsModule } from 'src/auth/guards.module';

@Module({
  imports: [GuardsModule],
  providers: [IdeaService, PrismaService],
  controllers: [IdeaController]
})
export class IdeaModule {}
