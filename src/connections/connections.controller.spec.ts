import { Test, TestingModule } from "@nestjs/testing"
import { ConnectionsController } from "./connections.controller"
import { ConnectionsService } from "./connections.service"
import { GestorGuard } from "../auth/gestor-auth.guard"
import { AvaliadorGuard } from "../auth/avaliador-auth.guard"
import { ComumGuard } from "../auth/comum-auth.guard"
import { RolesOrGuard } from "../auth/rolesOrGuard.guard"
import { CreateConnectionsDTO } from "./dto/create-connections.dto"
import { StatusConnectios } from "@prisma/client"
import { ConflictException } from "@nestjs/common"

describe('Connection Controller Test', () => {
    let controller: ConnectionsController
    let service: ConnectionsService

    const mockConnectionService = {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ConnectionsController],
            providers: [
                {
                    provide: ConnectionsService,
                    useValue: mockConnectionService
                },
                {
                    provide: GestorGuard,
                    useValue: true
                },
                {
                    provide: AvaliadorGuard,
                    useValue: true
                },
                {
                    provide: ComumGuard,
                    useValue: true
                },
                {
                    provide: RolesOrGuard,
                    useValue: true
                }
            ]
        }).compile()

        controller = module.get<ConnectionsController>(ConnectionsController)
        service = module.get<ConnectionsService>(ConnectionsService)
    })

    it("deve criar uma nova conexão", async () => {
        const dto: CreateConnectionsDTO = {
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

        const result = { id: '1', ...dto }

        mockConnectionService.create.mockResolvedValue(result)

        expect(await controller.create(dto)).toEqual(result)
        expect(service.create).toHaveBeenCalledWith(dto)
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
        mockConnectionService.findMany.mockResolvedValue(connections)

        expect(await controller.findMany()).toEqual(connections)
        expect(service.findMany).toHaveBeenCalled()
    })

    it("deve listar conexão por ID", async () => {
        const dto: CreateConnectionsDTO = {
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
        
        mockConnectionService.findUnique.mockResolvedValue(dto)

        expect(await controller.findUnique('1')).toEqual(dto)
        expect(service.findUnique).toHaveBeenCalledWith('1')
    })

    it("deve lançar ConflictException se não encontrar o ID da conexão", async () => {
        mockConnectionService.findUnique.mockRejectedValue(new ConflictException(`Conexão não encontrada`))
        await expect(controller.findUnique('9999')).rejects.toThrow(ConflictException)
    })

    it("deve atualizar a conexão por id", async () => {
        const dto: CreateConnectionsDTO = {
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

        const result = { id: '1', ...dto }

        mockConnectionService.update.mockResolvedValue(result)
        
        expect(await controller.update('1', dto)).toEqual(result)
        expect(service.update).toHaveBeenCalledWith('1', dto)
    })

    it("deve lançar ConflictException se não encontrar o ID da conexão ao tentar atualizar", async () => {
        const connection = {
            challengeID: "e450df40-a598-4f39-9846-2b62e80b6e88",
            companyID: "b71afd3b-d588-4316-aabe-573b7d6bc59c",
            startupID: "46849917-02bf-412b-b59f-f0a61416e475",
            status: StatusConnectios.NAO_INTERESSE,
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
        mockConnectionService.update.mockRejectedValue(new ConflictException(`Conexão não encontrada`))
        await expect(controller.update('9999', connection)).rejects.toThrow(ConflictException)
    })

    it("deve deletar a conexão por ID", async () => {
        const connection = {
            challengeID: "e450df40-a598-4f39-9846-2b62e80b6e88",
            companyID: "b71afd3b-d588-4316-aabe-573b7d6bc59c",
            startupID: "46849917-02bf-412b-b59f-f0a61416e475",
            status: StatusConnectios.NAO_INTERESSE,
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
        mockConnectionService.delete.mockResolvedValue(connection)
        expect(await controller.delete('1')).toEqual(connection)
        expect(service.delete).toHaveBeenCalledWith('1')
    })

    it("deve lançar ConflictException se não encontrar o ID da conexão ao tentar deletar", async () => {
        mockConnectionService.delete.mockRejectedValue(new ConflictException(`Conexão não encontrada`))
        await expect(controller.delete('9999')).rejects.toThrow(ConflictException)
    })
})