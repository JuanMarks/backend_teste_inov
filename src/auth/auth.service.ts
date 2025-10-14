import { Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUserDTO';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciais inválidas');

    return user;
}

  async register(dto: CreateUserDto, currentUser: { id: string; role: Role; companyId?: string }) {
    // Regras de quem pode criar quem
    if (dto.role === Role.ADMIN) {
      throw new ForbiddenException('Não é permitido criar Admin via API');
    }

    if (dto.role === Role.GESTOR && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Somente Admin pode criar Gestores');
    }

    if ((dto.role === Role.AVALIADOR || dto.role === Role.COMUM) && currentUser.role !== Role.GESTOR) {
      throw new ForbiddenException('Somente Gestores podem criar Avaliadores e Usuários');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hash,
        role: dto.role,
        companyId: (currentUser.role === Role.ADMIN || currentUser.role === Role.GESTOR) 
        ? dto.companyId 
        : currentUser.companyId, // se vier null ou undefined, salva null
      },
    });
  }

  // /backend_teste_inov/src/auth/auth.service.ts

async login(data: LoginDto) {
    const user = await this.validateUser(data.email, data.password);
    if (!user) {
      throw new ForbiddenException('Credenciais inválidas');
    }

    const payload = {
      id: user.id,
      role: user.role,
      companyId: user.companyId,
      email: user.email,
    };

    // Remove a senha do objeto de usuário antes de retorná-lo
    const { password, ...userResult } = user;

    return {
      access_token: this.jwtService.sign(payload),
      user: userResult, // <-- AQUI ESTÁ A MUDANÇA
    };
  }
}