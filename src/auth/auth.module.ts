import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy'; 
import { ComumGuard } from './comum-auth.guard';
import { AvaliadorGuard } from './avaliador-auth.guard';
import { GestorGuard } from './gestor-auth.guard';
import { RolesOrGuard } from './rolesOrGuard.guard';
import { CloudinaryService } from './cloudinary.service';
import { AdminGuard } from './admin.guard';
import "dotenv/config";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultsecret', // usar variável de ambiente
      signOptions: { expiresIn: '1d' }, // expiração do token
    }),
  ],
  providers: [AuthService, CloudinaryService, PrismaService, JwtStrategy, ComumGuard, AvaliadorGuard, GestorGuard, RolesOrGuard, AdminGuard],
  controllers: [AuthController],
  exports: [AuthService,],
})
export class AuthModule {}