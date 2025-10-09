import { BadRequestException, Injectable, NotFoundException, Param } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIdeaDto } from './dto/createIdeaDto';
import { UpdateIdeaDto } from './dto/updateIdeaDto';

@Injectable()
export class IdeaService {
    constructor(private prisma: PrismaService){}

    async create(data: CreateIdeaDto){
        
        return await this.prisma.idea.create({data})
    }

    async getAllIdeas(){
        return await this.prisma.idea.findMany()
    }

    async getIdeaById(id: string){
        const existing = await this.prisma.idea.findUnique({where: {id}})

        if(!existing){
            throw new NotFoundException(`Ideia com id:${id} não encontrado.`)
        }

        return existing
    }

    async update(id: string, data: UpdateIdeaDto){
        const existing = await this.prisma.idea.findUnique({where: {id}})

        if(!existing){
            throw new NotFoundException(`Ideia com id:${id} não encontrado.`)
        }

        return await this.prisma.idea.update({where: {id}, data})
    }

    async delete(id: string){
        const existing = await this.prisma.idea.findUnique({where: {id}})

        if(!existing){
            throw new NotFoundException(`Ideia com id:${id} não encontrado.`)
        }

        return await this.prisma.idea.delete({where:{id}})
    }
    
}
