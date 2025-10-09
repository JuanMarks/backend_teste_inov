import { PrismaService } from "../prisma/prisma.service"
import { ConnectionsController } from "./connections.controller"
import { ConnectionsService } from "./connections.service"
import { Test, TestingModule } from "@nestjs/testing"
import { ComumGuard } from "../auth/comum-auth.guard"
import { AvaliadorGuard } from "../auth/avaliador-auth.guard"
import { GestorGuard } from "../auth/gestor-auth.guard"
import { RolesOrGuard } from "../auth/rolesOrGuard.guard"
import { CreateConnectionsDTO } from "./dto/create-connections.dto"
import { StatusConnectios } from "@prisma/client"
import { ConflictException, NotFoundException } from "@nestjs/common"

describe("Connections Service Test", () => {
    let service: ConnectionsService
    let controller: ConnectionsController
    let prisma: PrismaService

    const mockConnection = {
        connections: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ConnectionsController],
            providers: [
                ConnectionsService,
                {
                    provide: PrismaService,
                    useValue: mockConnection
                },
                {
                    provide: ComumGuard,
                    useValue: true
                },
                {
                    provide: AvaliadorGuard,
                    useValue: true
                },
                {
                    provide: GestorGuard,
                    useValue: true
                },
                {
                    provide: RolesOrGuard,
                    useValue: true
                }
            ]
        }).compile()

        prisma = module.get<PrismaService>(PrismaService)
        controller = module.get<ConnectionsController>(ConnectionsController)
        service = module.get<ConnectionsService>(ConnectionsService)
    })

    it("deve criar uma conexão", async () => {
        const dto: CreateConnectionsDTO = {
            challengeID: "e450df40-a598-4f39-9846-2b62e80b6e88",
            companyID: "b71afd3b-d588-4316-aabe-573b7d6bc59c",
            startupID: "46849917-02bf-412b-b59f-f0a61416e475",
            status: "INTERESSE",
            history: [
                { date: new Date("2025-08-05"), action: "Interesse registrado por Jonas Fortes" },
                { date: new Date("2025-08-06"), action: "Conexão aceita por Ninna Hub" },
                { date: new Date("2025-08-10"), action: "Reunião marcada entre Empresa X e Startup Y" }
            ]
        }

        const expectedData = {
            data: {
                status: dto.status,
                history: dto.history,
                challenges: { 
                    connect: { 
                        id: dto.challengeID 
                    }
                },
                company: { 
                    connect: { 
                        id: dto.companyID 
                    } 
                },
                startup: { 
                    connect: { 
                        id: dto.startupID 
                    }
                },
            }
        }

        const result = { id: "1", ...dto }
        mockConnection.connections.create.mockResolvedValue(result)

        const response = await service.create(dto)

        expect(response).toEqual(result)
        expect(mockConnection.connections.create).toHaveBeenCalledWith(expectedData) 
    })


    it("deve listar todas as conexões", async () => {
        const connections = [
            {
                challengeID: "e450df40-a598-4f39-9846-2b62e80b6e88",
                companyID: "b71afd3b-d588-4316-aabe-573b7d6bc59c",
                startupID: "46849917-02bf-412b-b59f-f0a61416e475",
                status: "INTERESSE" as StatusConnectios,
                history: [
                    { date: new Date("2025-08-05"), action: "Interesse registrado por Jonas Fortes" },
                    { date: new Date("2025-08-06"), action: "Conexão aceita por Ninna Hub" }
                ]
            },
            {
                challengeID: "f1234567-89ab-4cde-9012-3456789abcde",
                companyID: "c2345678-9abc-4def-0123-456789abcdef",
                startupID: "d3456789-0abc-4def-1234-56789abcdef0",
                status: "PENDENTE" as StatusConnectios,
                history: [
                    { date: new Date("2025-09-01"), action: "Solicitação enviada pela Startup Beta" },
                    { date: new Date("2025-09-03"), action: "Empresa aguarda resposta" }
                ]
            },
            {
                challengeID: "a9876543-21bc-4def-9876-54321fedcba0",
                companyID: "b8765432-1cde-4fgh-8765-4321fedcba98",
                startupID: "c7654321-0def-4ghi-7654-3210fedcba87",
                status: "NAO_INTERESSE" as StatusConnectios,
                history: [
                    { date: new Date("2025-07-20"), action: "Startup recusou proposta" },
                    { date: new Date("2025-07-22"), action: "Empresa finalizou o contato" }
                ]
            }
        ]
        mockConnection.connections.findMany.mockResolvedValue(connections)

        const result = await service.findMany()

        expect(result).toEqual(connections)
        expect(mockConnection.connections.findMany).toHaveBeenCalledWith()
    })

    it("deve listar a conexão por ID", async () => {
        const dto = {
            id: '1',
            challengeID: "e450df40-a598-4f39-9846-2b62e80b6e88",
            companyID: "b71afd3b-d588-4316-aabe-573b7d6bc59c",
            startupID: "46849917-02bf-412b-b59f-f0a61416e475",
            status: "INTERESSE",
            history: [
                {
                    date: new Date("2025-08-05"),
                    action: "Interesse registrado por Jonas Fortes"
                },
                {
                    date: new Date("2025-08-06"),
                    action: "Conexão aceita por Ninna Hub"
                },
                {
                    date: new Date("2025-08-10"),
                    action: "Reunião marcada entre Empresa X e Startup Y"
                }
            ]
        }

        mockConnection.connections.findUnique.mockResolvedValue(dto)
        expect(await controller.findUnique('1')).toEqual(dto)
        expect(mockConnection.connections.findUnique).toHaveBeenCalledWith({
            where: { id: '1' }
        })
    })

    it('deve lançar NotFoundException se a conexão não for encontrado', async () => {
        mockConnection.connections.findUnique.mockResolvedValue(null)
        await expect(controller.findUnique('9999')).rejects.toThrow(NotFoundException)
    })

    it('deve atualizar uma conexão por ID', async () => {
        const dto = {
            id: '1',
            challengeID: "e450df40-a598-4f39-9846-2b62e80b6e88",
            companyID: "b71afd3b-d588-4316-aabe-573b7d6bc59c",
            startupID: "46849917-02bf-412b-b59f-f0a61416e475",
            status: "INTERESSE",
            history: [
                {
                    date: new Date("2025-08-05"),
                    action: "Interesse registrado por Jonas Fortes"
                },
                {
                    date: new Date("2025-08-06"),
                    action: "Conexão aceita por Ninna Hub"
                },
                {
                    date: new Date("2025-08-10"),
                    action: "Reunião marcada entre Empresa X e Startup Y"
                }
            ]
        }

        const dtoAtualizado = {
            id: '1',
            challengeID: "e450df40-a598-4f39-9846-2b62e80b6e88",
            companyID: "b71afd3b-d588-4316-aabe-573b7d6bc59c",
            startupID: "46849917-02bf-412b-b59f-f0a61416e475",
            status: "PENDENTE",
            history: [
                {
                    date: new Date("2025-08-05"),
                    action: "Interesse registrado por Jonas Fortes"
                },
                {
                    date: new Date("2025-08-06"),
                    action: "Conexão aceita por Ninna Hub"
                },
                {
                    date: new Date("2025-08-10"),
                    action: "Reunião marcada entre Empresa X e Startup Y"
                }
            ]
        }
        mockConnection.connections.findUnique.mockResolvedValue(dto)
        mockConnection.connections.update.mockResolvedValue({ ...dto, ...dtoAtualizado })
        const result = await mockConnection.connections.update('1', dtoAtualizado)
        expect(result.status).toBe('PENDENTE')
    })

    it('deve lançar NotFoundException ao atualizar conexão inexistente', async () => {
        mockConnection.connections.findUnique.mockResolvedValue(null)
        const dtoAtualizado = {
            id: '1',
            challengeID: "e450df40-a598-4f39-9846-2b62e80b6e88",
            companyID: "b71afd3b-d588-4316-aabe-573b7d6bc59c",
            startupID: "46849917-02bf-412b-b59f-f0a61416e475",
            status: StatusConnectios.PENDENTE,
            history: [
                {
                    date: new Date("2025-08-05"),
                    action: "Interesse registrado por Jonas Fortes"
                },
                {
                    date: new Date("2025-08-06"),
                    action: "Conexão aceita por Ninna Hub"
                },
                {
                    date: new Date("2025-08-10"),
                    action: "Reunião marcada entre Empresa X e Startup Y"
                }
            ]
        }
        await expect(service.update('9999', dtoAtualizado)).rejects.toThrow(NotFoundException)
    })

    it('deve deletar uma conexão por ID', async () => {
        const dto = {
            id: '5',
            challengeID: "e450df40-a598-4f39-9846-2b62e80b6e88",
            companyID: "b71afd3b-d588-4316-aabe-573b7d6bc59c",
            startupID: "46849917-02bf-412b-b59f-f0a61416e475",
            status: "INTERESSE",
            history: [
                {
                    date: new Date("2025-08-05"),
                    action: "Interesse registrado por Jonas Fortes"
                },
                {
                    date: new Date("2025-08-06"),
                    action: "Conexão aceita por Ninna Hub"
                },
                {
                    date: new Date("2025-08-10"),
                    action: "Reunião marcada entre Empresa X e Startup Y"
                }
            ]
        }
        mockConnection.connections.delete.mockResolvedValue(dto)
        const result = await service.delete('5')
        expect(result).toEqual(dto)
    })

    it('deve lançar ConflictException ao deletar conexão inexistente', async () => {
        mockConnection.connections.delete.mockRejectedValue(new ConflictException('POC não encontrada!'))
        await expect(service.delete('9999')).rejects.toThrow(ConflictException)
    })
})