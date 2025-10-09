import { Module } from '@nestjs/common';
import { StartupService } from './startup.service';
import { StartupController } from './startup.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { GuardsModule } from 'src/auth/guards.module';

@Module({
  imports: [PrismaModule, GuardsModule],
  controllers: [StartupController],
  providers: [StartupService, PrismaService],
})
export class StartupModule {}
