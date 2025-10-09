import { Test, TestingModule } from '@nestjs/testing'
import { POCController } from './poc.controller'
import { POCService } from './poc.service'
import { CreatePOCdto } from './dto/create-poc.dto'
import { ConflictException } from '@nestjs/common'

describe('POC Controller Test', () => {
    let controller: POCController
    let service: POCService

    const mockPOCService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [POCController],
            providers: [{ provide: POCService, useValue: mockPOCService }],
        }).compile()

        controller = module.get<POCController>(POCController)
        service = module.get<POCService>(POCService)
    })

    it('deve criar uma POC', async () => {
        const dto: CreatePOCdto = {
            title: 'POC de Teste',
            targets: 'Alvo teste',
            deadlines: '10/10/2025',
            indicators: 'Indicador teste',
            userId: '123e4567-e89b-12d3-a456-426614174000',
        }
        const result = { id: '1', ...dto }

        mockPOCService.create.mockResolvedValue(result)

        expect(await controller.create(dto)).toEqual(result)
        expect(service.create).toHaveBeenCalledWith(dto)
    })

    it('deve listar todas as POCs', async () => {
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
        mockPOCService.findAll.mockResolvedValue(pocs)

        expect(await controller.findAll()).toEqual(pocs)
        expect(service.findAll).toHaveBeenCalled()
    })

    it('deve retornar uma POC por ID', async () => {
        const poc = {
            title: 'POC de Teste',
            targets: 'Alvo teste',
            deadlines: '10/10/2025',
            indicators: 'Indicador teste',
            userId: '123e4567-e89b-12d3-a456-426614174000',
        }
        mockPOCService.findUnique.mockResolvedValue(poc)

        expect(await controller.findUnique('1')).toEqual(poc)
        expect(service.findUnique).toHaveBeenCalledWith('1')
    })

    it('deve lançar ConflictException ao buscar POC inexistente', async () => {
        mockPOCService.findUnique.mockRejectedValue(
            new ConflictException('POC não encontrada!')
        )

        await expect(controller.findUnique('9999')).rejects.toThrow(
            ConflictException
        )
    })

    it('deve atualizar uma POC', async () => {
        const poc = {
            title: 'POC de Teste',
            targets: 'Alvo teste',
            deadlines: '10/10/2025',
            indicators: 'Indicador teste',
            userId: '123e4567-e89b-12d3-a456-426614174000',
        }
        const result = { id: '1', ...poc }

        mockPOCService.update.mockResolvedValue(result)

        expect(await controller.update('1', poc)).toEqual(result)
        expect(service.update).toHaveBeenCalledWith('1', poc)
    })

    it('deve lançar ConflictException ao atualizar POC inexistente', async () => {
        const dto = { title: 'POC Atualizada' }

        mockPOCService.update.mockRejectedValue(
            new ConflictException('POC não encontrada!')
        )

        await expect(controller.update('9999', dto)).rejects.toThrow(
            ConflictException
        )
    })

    it('deve deletar uma POC', async () => {
        const poc = {
            title: 'POC de Teste',
            targets: 'Alvo teste',
            deadlines: '10/10/2025',
            indicators: 'Indicador teste',
            userId: '123e4567-e89b-12d3-a456-426614174000',
        }
        mockPOCService.delete.mockResolvedValue(poc)

        expect(await controller.delete('1')).toEqual(poc)
        expect(service.delete).toHaveBeenCalledWith('1')
    })

    it('deve lançar ConflictException ao deletar POC inexistente', async () => {
        mockPOCService.delete.mockRejectedValue(
            new ConflictException('POC não encontrada!')
        )

        await expect(controller.delete('9999')).rejects.toThrow(ConflictException)
    })
})
