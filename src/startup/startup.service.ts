import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Prisma } from '@prisma/client';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { createStartupDTO } from './dto/create-startup.dto';
import { UpdateStartupDTO } from './dto/update-startup.dto';

@Injectable()
export class StartupService {
  constructor(private prisma: PrismaService) { }

  async create(data: createStartupDTO) {
    return this.prisma.startup.create({ data });
  }

  async findAll() {
    return this.prisma.startup.findMany();

  }

  async findOne(id: string) {
    const startup = await this.prisma.startup.findUnique({ where: { id } });

    if (!startup) {
      throw new ConflictException('Startup não encontrada');
    }

    return startup;
  }

  async findByTecnology(tecnology: string) {
    try {
      const startups = await this.prisma.startup.findMany({
        where: { 
          technology: {
            contains: tecnology,
            mode: 'insensitive'
          }
          
        }
      })
      return startups
    } catch {
      throw new NotFoundException(`Startups não encontradas ou não existentes`)
    }
  }

  async findBySegment(segment: string) {
    try {
      const startups = await this.prisma.startup.findMany({
        where: {
          segment: {
            contains: segment,
            mode: 'insensitive'
          }
        }
      })
      return startups
    } catch {
      throw new NotFoundException(`Startups não encontradas ou não existentes`)
    }
  }

  async findByProblem(problem: string){
    try {
      const startups = await this.prisma.startup.findMany({
        where: {
          problem: {
            contains: problem,
            mode: 'insensitive'
          }
        }
      })
      return startups
    } catch {
      throw new NotFoundException(`Startups não encontradas ou não existentes`)
    }
  }

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
