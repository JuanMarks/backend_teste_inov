import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { GestorGuard } from 'src/auth/gestor-auth.guard';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { InvitationsController } from './invitations.controller';
import { GuardsModule } from 'src/auth/guards.module';
import "dotenv/config";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1d' },
    }),
  GuardsModule],
  controllers: [InvitationsController],
  providers: [InvitationsService, MailService, PrismaService],
})
export class InvitationsModule {}
