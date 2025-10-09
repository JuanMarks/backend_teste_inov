import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Prisma } from '@prisma/client';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { createStartupDTO } from './dto/create-startup.dto';
import { UpdateStartupDTO } from './dto/update-startup.dto';

@Injectable()
export class StartupService {
  constructor(private prisma: PrismaService) { }

  //criar
  async create(data: createStartupDTO) {
    return this.prisma.startup.create({ data });
  }

  // Listar todos
  async findAll() {
    return this.prisma.startup.findMany();

  }

  // Buscar por ID
  async findOne(id: string) {
    const startup = await this.prisma.startup.findUnique({ where: { id } });

    if (!startup) {
      throw new ConflictException('Startup não encontrada');
    }

    return startup;
  }

  // Atualizar
  async update(id: string, data: UpdateStartupDTO) {
    const startup = await this.prisma.startup.findUnique({ where: { id } });

    if (!startup) {
      throw new ConflictException('Startup não encontrada');
    }

    return this.prisma.startup.update({
      where: { id },
      data,
    });
  }

  // Deletar
  async remove(id: string) {
    try {
      return this.prisma.startup.delete({
        where: { id }
      });
    } catch {
      throw new ConflictException('Startup não encontrada');
    }
  }
}
