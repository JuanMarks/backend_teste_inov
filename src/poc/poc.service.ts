import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePOCdto } from "./dto/create-poc.dto";
import { UpdatePocDTO } from "./dto/update-poc.dto";

@Injectable()
export class POCService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreatePOCdto) {
        return this.prisma.poc.create({
            data: {
                title: data.title,
                targets: data.targets,
                deadlines: data.deadlines,
                indicators: data.indicators,
                userId: data.userId
            }
        })
    }

    async findAll() {
        return this.prisma.poc.findMany()
    }

    async findUnique(id: string) {
        const poc = await this.prisma.poc.findUnique({ where: { id } })

        if (!poc) {
            throw new ConflictException('POC não encontrada!')
        }

        return poc
    }

    async update(id: string, data: UpdatePocDTO) {
        const poc = await this.prisma.poc.findUnique({ where: { id } })

        if (!poc) {
            throw new ConflictException('POC não encontrada!')
        }

        return this.prisma.poc.update({
            where: { id },
            data
        })
    }

    async delete(id: string) {
        try {
            return this.prisma.poc.delete({
                where: { id }
            })
        } catch (error) {
            throw new ConflictException('POC não encontrada!')
        }
    }
}