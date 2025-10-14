import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateChallengeDTO } from "./dto/create-challenge.dto";
import { UpdateChallengeDTO } from "./dto/uptade-challenge.dto";
import { Status, TypePublication } from "@prisma/client";

@Injectable()
export class ChallengeService {
    constructor(private prismaService: PrismaService) { }

    async create(dto: CreateChallengeDTO) {
        try {
            return await this.prismaService.challenges.create({
                data: {
                    name: dto.name,
                    description: dto.description,
                    area: dto.area,
                    startDate: dto.startDate,
                    endDate: dto.endDate,
                    images: dto.images,
                    tags: dto.tags,
                    categoria: dto.categoria,
                    type: dto.typePublication?.toUpperCase() as TypePublication,
                    status: dto.status?.toUpperCase() as Status,
                    ...(dto.companyId
                        ? {
                            company: {
                                connect: {
                                    id: dto.companyId
                                }
                            }
                        } : {}
                    )
                }
            })
        } catch (error) {
            if(error.code === 'P2025') {
                throw new NotFoundException(`
                    
                    Empresa com id ${dto.companyId} não encontrada!
                    
                    `)
            }
            throw error
        }
    }

    async findAllPaginated(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit

        const [data, total] = await this.prismaService.$transaction([
            this.prismaService.challenges.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prismaService.challenges.count()
        ])

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        }
    }

    async findByPublic() {
        const allChallenge = await this.prismaService.challenges.findMany({
            where: {
                type: TypePublication.PUBLICO
            }
        })

        return allChallenge
    }

    async findByCompany(companyId: string) {
        const allChallenge = await this.prismaService.challenges.findMany({
            where: {
                companyId
            }
        })

        return allChallenge
    }


    async findByRestricted() {
        const allChallenge = await this.prismaService.challenges.findMany({
            where: {
                type: TypePublication.RESTRITO
            }
        })

        return allChallenge
    }

    async findById(id: string) {
        const founderChallenge = await this.prismaService.challenges.findUnique({
            where: { id }
        })

        if (!founderChallenge) {
            throw new ConflictException(`
                
                Desafio com id ${id} não encontrado!
                
                `)
        }

        return founderChallenge
    }

    async update(id: string, dto: UpdateChallengeDTO) {
        const challenge = await this.prismaService.challenges.findUnique({ where: { id } })

        if (!challenge) {
            throw new ConflictException(`
                
                Desafio com id ${id} não encontrado!
                
                `)
        }

        return this.prismaService.challenges.update({
            where: { id },
            data: {
                ...dto,
                type: dto.typePublication?.toUpperCase() as TypePublication,
                status: dto.status?.toUpperCase() as Status
            }
        })
    }

    async delete(id: string) {
        try {
            return await this.prismaService.challenges.delete({ where: { id } })
        } catch {
            throw new ConflictException(`
                
                Desafio com id ${id} não encontrado!
                
                `)
        }
    }
}