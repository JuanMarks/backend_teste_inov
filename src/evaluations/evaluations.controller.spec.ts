import { Test, TestingModule } from "@nestjs/testing"
import { EvaluationsController } from "./evaluations.controller"
import { EvaluationsService } from "./evaluations.service"
import { CreateEvaluationDto } from "./dto/create-evaluation.dto"
import { NotFoundException } from "@nestjs/common"
import { Stage } from "@prisma/client"

describe('Evaluations Controller Test', () => {
    let controller: EvaluationsController
    let service: EvaluationsService

    const mockEvaluation = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EvaluationsController],
            providers: [{ provide: EvaluationsService, useValue: mockEvaluation }]
        }).compile()

        controller = module.get<EvaluationsController>(EvaluationsController)
        service = module.get<EvaluationsService>(EvaluationsService)
    })

    it("deve criar uma avaliação", async () => {
        const evaluation: CreateEvaluationDto = {
            stage: 'GERACAO',
            ideaId: '123e4567-e89b-12d3-a456-426614174000',
            evaluatorId: '123e4567-e89b-12d3-a456-426614174001'
        }

        const result = { id: '1', ...evaluation }

        mockEvaluation.create.mockResolvedValue(result)

        expect(await controller.create(evaluation)).toEqual(result)
        expect(service.create).toHaveBeenCalledWith(evaluation)
    })

    it("deve listar todas as avaliações", async () => {
        const evaluations = [
            {
                stage: 'GERACAO',
                ideaId: '123e4567-e89b-12d3-a456-426614174000', // ligado ao 1º POC
                evaluatorId: '123e4567-e89b-12d3-a456-426614174001'
            },
            {
                stage: 'GERACAO',
                ideaId: '223e4567-e89b-12d3-a456-426614174000', // ligado ao 2º POC
                evaluatorId: '223e4567-e89b-12d3-a456-426614174001'
            },
            {
                stage: 'GERACAO',
                ideaId: '323e4567-e89b-12d3-a456-426614174000', // ligado ao 3º POC
                evaluatorId: '323e4567-e89b-12d3-a456-426614174001'
            }
        ]
        mockEvaluation.findAll.mockResolvedValue(evaluations)

        expect(await controller.findAll()).toEqual(evaluations)
        expect(service.findAll).toHaveBeenCalled()
    })

    it("deve listar avaliação por id", async () => {
        const evaluation = {
            id: '1',
            stage: 'GERACAO',
            ideaId: '123e4567-e89b-12d3-a456-426614174000', // ligado ao 1º POC
            evaluatorId: '123e4567-e89b-12d3-a456-426614174001'
        }
        mockEvaluation.findOne.mockResolvedValue(evaluation)

        expect(await controller.findOne('1')).toEqual(evaluation)
        expect(service.findOne).toHaveBeenCalledWith('1')
    })

    it("deve lançar NotFoundException ao buscar id inexistente", async () => {
        mockEvaluation.findOne.mockRejectedValue(new NotFoundException('Avaliação não encontrada'))
        await expect(controller.findOne('9999')).rejects.toThrow(NotFoundException)
    })

    it("deve atualizar uma avaliação por id", async () => {
       const evaluation = {
            id: '1',
            stage: Stage.EXPERIMENTACAO,
            ideaId: '123e4567-e89b-12d3-a456-426614174000',
            evaluatorId: '123e4567-e89b-12d3-a456-426614174001'
        } 
        const result = { ...evaluation }
        mockEvaluation.update.mockResolvedValue(result)
        expect(await controller.update('1', evaluation)).toEqual(evaluation)
        expect(service.update).toHaveBeenCalledWith('1', evaluation)
    })

    it("deve lançar NotFoundException ao atualizar avaliação inexistente", async () => {
        const evaluationAtualizada = {
            id: '1',
            stage: Stage.GERACAO, 
            ideaId: '123e4567-e89b-12d3-a456-426614174000',
            evaluatorId: '123e4567-e89b-12d3-a456-426614174001'
        }
        mockEvaluation.update.mockRejectedValue(new NotFoundException('Avaliação não encontrada'))
        await expect(controller.update('9999', evaluationAtualizada)).rejects.toThrow(NotFoundException)
    })

    it("deve deletar uma avaliação por id", async () => {
       const evaluation = {
            id: '1',
            stage: Stage.EXPERIMENTACAO,
            ideaId: '123e4567-e89b-12d3-a456-426614174000',
            evaluatorId: '123e4567-e89b-12d3-a456-426614174001'
        } 
        mockEvaluation.remove.mockResolvedValue(evaluation)
        expect(await controller.remove('1')).toEqual(evaluation)
        expect(service.remove).toHaveBeenCalledWith('1') 
    })

    it("deve lançar NotFoundException ao deletar avaliação inexistente", async () => {
        mockEvaluation.remove.mockRejectedValue(new NotFoundException('Avaliação não encontrada'))
        await expect(controller.remove('9999')).rejects.toThrow(NotFoundException)
    })
})