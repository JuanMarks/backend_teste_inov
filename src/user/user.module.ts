import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GuardsModule } from 'src/auth/guards.module';

@Module({
  imports: [GuardsModule],
  controllers: [UserController],
  providers: [UserService, PrismaService]
})
export class UserModule {}
