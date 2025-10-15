import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Injectable()
export class EvaluationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEvaluationDto) {
    return this.prisma.evaluations.create({
      data: {
        stage: dto.stage,
        ideaId: dto.ideaId,
        evaluatorId: dto.evaluatorId,
      },
    });
  }

  async findAll() {
    return this.prisma.evaluations.findMany({
      include: {
        idea: true,
        evaluator: true,
        criteria: true,
        comments: true,
      },
    });
  }

  async findOne(id: string) {
    const evaluation = await this.prisma.evaluations.findUnique({
      where: { id },
      include: {
        idea: true,
        evaluator: true,
        criteria: true,
        comments: true,
      },
    });

    if (!evaluation) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    return evaluation;
  }

  async update(id: string, dto: UpdateEvaluationDto) {
    const existing = await this.findOne(id);

    if(!existing){
      throw new NotFoundException(`Avaliação com ID ${id} não existente!`)
    }

    return this.prisma.evaluations.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.evaluations.delete({
      where: { id },
    });
  }
}
