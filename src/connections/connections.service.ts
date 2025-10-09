import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateConnectionsDTO } from "./dto/create-connections.dto";
import { Prisma } from "@prisma/client";
import { UpdateConnectionDTO } from "./dto/update-connections.dto";

@Injectable()
export class ConnectionsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateConnectionsDTO) {
        try {
            return await this.prisma.connections.create({
                data: {
                    status: dto.status,
                    history: dto.history as unknown as Prisma.InputJsonValue,
                    challenges: {
                        connect: { id: dto.challengeID },
                    },
                    company: {
                        connect: { id: dto.companyID },
                    },
                    startup: {
                        connect: { id: dto.startupID },
                    },
                },
            });
        } catch (error) {
            if (error) {
                throw new BadRequestException(
                    `Erro ao criar conexão: ${error.message}`
                );
            }
            throw error;
        }
    }

    async findMany() {
        return this.prisma.connections.findMany()
    }

    async findUnique(id: string) {
        const connectionFound = await this.prisma.connections.findUnique({
            where: { id }
        })

        if (!connectionFound) {
            throw new NotFoundException(`Conexão com id ${id} não encontrada`)
        }

        return connectionFound
    }

    async update(id: string, dto: UpdateConnectionDTO) {
        const connection = await this.prisma.connections.findUnique({ where: { id } })

        if (!connection) {
            throw new NotFoundException(`Conexão com id ${id} não encontrada`)
        }

        const data: any = {
            status: dto.status,
            history: dto.history as unknown as Prisma.InputJsonValue
        }

        if(dto.challengeID){
            data.challenges = {
                connect: {
                    id: dto.challengeID
                }
            }
        }

        if(dto.companyID){
            data.company = {
                connect: {
                    id: dto.companyID
                }
            }
        }

        if(dto.startupID){
            data.startup = {
                connect: {
                    id: dto.startupID
                }
            }
        }

        return this.prisma.connections.update({
            where: { id },
            data
        })
    }

    async delete(id: string) {
        try {
            return this.prisma.connections.delete({
                where: { id }
            })
        } catch {
            throw new NotFoundException(`Conexão não encontrada`)
        }
    }
}
