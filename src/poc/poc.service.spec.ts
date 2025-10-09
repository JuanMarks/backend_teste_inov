import { PrismaService } from "../prisma/prisma.service"
import { POCService } from "./poc.service"
import { POCController } from "./poc.controller"
import { Test, TestingModule } from "@nestjs/testing"
import { ComumGuard } from "../auth/comum-auth.guard"
import { AvaliadorGuard } from "../auth/avaliador-auth.guard"
import { GestorGuard } from "../auth/gestor-auth.guard"
import { RolesOrGuard } from "../auth/rolesOrGuard.guard"
import { CreatePOCdto } from "./dto/create-poc.dto"
import { ConflictException } from "@nestjs/common"

describe('POC Service Test', () => {
    let service: POCService
    let prisma: PrismaService
    let controller: POCController

    const mockPOC = {
        poc: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [POCController],
            providers: [
                POCService,
                { provide: PrismaService, useValue: mockPOC },
                { provide: ComumGuard, useValue: true },
                { provide: AvaliadorGuard, useValue: true },
                { provide: GestorGuard, useValue: true },
                { provide: RolesOrGuard, useValue: true }
            ]
        }).compile()

        prisma = module.get<PrismaService>(PrismaService)
        controller = module.get<POCController>(POCController)
        service = module.get<POCService>(POCService)
    })

    it('deve criar uma POC', async () => {
        const poc: CreatePOCdto = {
            title: 'POC de Monitoramento de Vacinas',
            targets: 'Implementar sensores IoT para monitorar a temperatura e validade das vacinas',
            deadlines: 'Finalizar protótipo até 15/10/2025 e validar em campo até 30/10/2025',
            indicators: 'Redução de 90% nas perdas de vacinas por má conservação; dashboard em tempo real',
            userId: '123e4567-e89b-12d3-a456-426614174000'
        }

        const result = { id: '893x8h83hdjj', ...poc }

        mockPOC.poc.create.mockResolvedValue(result)

        const response = await service.create(poc)

        expect(response).toEqual(result)
        expect(mockPOC.poc.create).toHaveBeenCalledWith({
            data: poc
        })
    })

    it('deve listar todas as POC', async () => {
        const pocs = [
            {
                title: 'POC de Monitoramento de Vacinas',
                targets: 'Implementar sensores IoT para monitorar a temperatura e validade das vacinas',
                deadlines: 'Finalizar protótipo até 15/10/2025 e validar em campo até 30/10/2025',
                indicators: 'Redução de 90% nas perdas de vacinas por má conservação; dashboard em tempo real',
                userId: '123e4567-e89b-12d3-a456-426614174000'
            },
            {
                title: 'POC de Gestão de Resíduos Inteligente',
                targets: 'Aplicar sensores de volume em lixeiras públicas para otimizar rotas de coleta',
                deadlines: 'Testar em 3 bairros até 20/11/2025 e expandir para toda a cidade até 10/12/2025',
                indicators: 'Redução de 40% nos custos de coleta; aumento de 25% na reciclagem',
                userId: '223e4567-e89b-12d3-a456-426614174000'
            },
            {
                title: 'POC de Energia Solar Comunitária',
                targets: 'Instalar painéis solares em escolas municipais para gerar energia limpa',
                deadlines: 'Concluir instalação em 2 escolas até 05/12/2025 e avaliar impacto até 20/12/2025',
                indicators: 'Economia de 60% na conta de energia; redução de 50 toneladas de CO₂ ao ano',
                userId: '323e4567-e89b-12d3-a456-426614174000'
            }
        ]
        mockPOC.poc.findMany.mockResolvedValue(pocs)

        const result = await service.findAll()

        expect(result).toEqual(pocs)
        expect(mockPOC.poc.findMany).toHaveBeenCalledWith()
    })

    it('deve listar a POC por ID', async () => {
        const poc = {
            id: '1',
            title: 'POC de Monitoramento de Vacinas',
            targets: 'Implementar sensores IoT para monitorar a temperatura e validade das vacinas',
            deadlines: 'Finalizar protótipo até 15/10/2025 e validar em campo até 30/10/2025',
            indicators: 'Redução de 90% nas perdas de vacinas por má conservação; dashboard em tempo real',
            userId: '123e4567-e89b-12d3-a456-426614174000'
        }
        mockPOC.poc.findUnique.mockResolvedValue(poc)

        expect(await controller.findUnique('1')).toEqual(poc)
        expect(mockPOC.poc.findUnique).toHaveBeenCalledWith({
            where: { id: '1' }
        })
    })

    it('deve lançar ConflictException se o POC não for encontrado', async () => {
        mockPOC.poc.findUnique.mockResolvedValue(null)
        await expect(controller.findUnique('9999')).rejects.toThrow(ConflictException)
    })

    it('deve atualizar uma POC por ID', async () => {
        const PocAtual = {
            title: 'POC de Monitoramento de Vacinas 2.0',
            targets: 'Implementar sensores IoT para monitorar a temperatura e validade das vacinas',
            deadlines: 'Finalizar protótipo até 15/10/2025 e validar em campo até 30/10/2025',
            indicators: 'Redução de 90% nas perdas de vacinas por má conservação; dashboard em tempo real',
            userId: '123e4567-e89b-12d3-a456-426614174000'
        }

        const PocAtualizada = {
            title: 'POC de Monitoramento de Vacinas',
            targets: 'Implementar sensores IoT para monitorar a temperatura e validade das vacinas',
            deadlines: 'Finalizar protótipo até 15/10/2025 e validar em campo até 30/10/2025',
            indicators: 'Redução de 90% nas perdas de vacinas por má conservação; dashboard em tempo real',
            userId: '123e4567-e89b-12d3-a456-426614174000'
        }
        mockPOC.poc.findUnique.mockResolvedValue(PocAtual)
        mockPOC.poc.update.mockResolvedValue({ ...PocAtual, ...PocAtualizada })
        const result = await mockPOC.poc.update('1', PocAtualizada)
        expect(result.title).toBe('POC de Monitoramento de Vacinas')
    })

    it('deve lançar ConflictException ao atualizar POC inexistente', async () => {
        mockPOC.poc.findUnique.mockResolvedValue(null)
        const PocAtualizada = {
            title: 'POC de Monitoramento de Vacinas',
            targets: 'Implementar sensores IoT para monitorar a temperatura e validade das vacinas',
            deadlines: 'Finalizar protótipo até 15/10/2025 e validar em campo até 30/10/2025',
            indicators: 'Redução de 90% nas perdas de vacinas por má conservação; dashboard em tempo real',
            userId: '123e4567-e89b-12d3-a456-426614174000'
        }
        await expect(service.update('9999', PocAtualizada)).rejects.toThrow(ConflictException)
    })

    it('deve deletar uma POC por ID', async () => {
        const poc = {
            id: '5',
            title: 'POC de Monitoramento de Vacinas 2.0',
            targets: 'Implementar sensores IoT para monitorar a temperatura e validade das vacinas',
            deadlines: 'Finalizar protótipo até 15/10/2025 e validar em campo até 30/10/2025',
            indicators: 'Redução de 90% nas perdas de vacinas por má conservação; dashboard em tempo real',
            userId: '123e4567-e89b-12d3-a456-426614174000'
        }
        mockPOC.poc.delete.mockResolvedValue(poc)
        const result = await service.delete('5')
        expect(result).toEqual(poc)
    })

    it('deve lançar ConflictException ao deletar POC inexistente', async () => {
        mockPOC.poc.delete.mockRejectedValue(new ConflictException('POC não encontrada!'))
        await expect(service.delete('9999')).rejects.toThrow(ConflictException)
    })
})