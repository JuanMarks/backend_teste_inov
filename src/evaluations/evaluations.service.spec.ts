import { PrismaService } from "../prisma/prisma.service"
import { EvaluationsService } from "./evaluations.service"
import { EvaluationsController } from "./evaluations.controller"
import { Test, TestingModule } from "@nestjs/testing"
import { ComumGuard } from "../auth/comum-auth.guard"
import { AvaliadorGuard } from "../auth/avaliador-auth.guard"
import { GestorGuard } from "../auth/gestor-auth.guard"
import { RolesOrGuard } from "../auth/rolesOrGuard.guard"
import { CreateEvaluationDto } from "./dto/create-evaluation.dto"
import { NotFoundException } from "@nestjs/common"
import { Stage } from "@prisma/client"

describe('Evaluations Service Test', () => {
    let service: EvaluationsService
    let prisma: PrismaService
    let controller: EvaluationsController

    const mockEvaluation = {
        evaluations: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EvaluationsController],
            providers: [
                EvaluationsService,
                { provide: PrismaService, useValue: mockEvaluation },
                { provide: ComumGuard, useValue: true },
                { provide: AvaliadorGuard, useValue: true },
                { provide: GestorGuard, useValue: true },
                { provide: RolesOrGuard, useValue: true }
            ]
        }).compile()

        prisma = module.get<PrismaService>(PrismaService)
        service = module.get<EvaluationsService>(EvaluationsService)
        controller = module.get<EvaluationsController>(EvaluationsController)
    })

    it("deve criar uma avaliação", async () => {
        const evaluation: CreateEvaluationDto = {
            stage: 'GERACAO',
            ideaId: '123e4567-e89b-12d3-a456-426614174000',
            evaluatorId: '123e4567-e89b-12d3-a456-426614174001'
        }

        const result = { id: '123e4567-e89b-12d3-a456-426614174000', ...evaluation }

        mockEvaluation.evaluations.create.mockResolvedValue(result)

        const response = await service.create(evaluation)

        expect(response).toEqual(result)
        expect(mockEvaluation.evaluations.create).toHaveBeenCalledWith({
            data: evaluation
        })
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

        mockEvaluation.evaluations.findMany.mockResolvedValue(evaluations)

        const result = await service.findAll()

        expect(result).toEqual(evaluations)
        expect(mockEvaluation.evaluations.findMany).toHaveBeenCalledWith({
            include: {
                idea: true,
                evaluator: true,
                comments: true,
                criteria: true
            }
        })
    })

    it("deve listar a avaliação por id", async () => {
        const evaluation = {
            id: '1',
            stage: 'GERACAO',
            ideaId: '123e4567-e89b-12d3-a456-426614174000', // ligado ao 1º POC
            evaluatorId: '123e4567-e89b-12d3-a456-426614174001'
        }
        mockEvaluation.evaluations.findUnique.mockResolvedValue(evaluation)

        expect(await controller.findOne('1')).toEqual(evaluation)
        expect(mockEvaluation.evaluations.findUnique).toHaveBeenCalledWith({
            where: { id: '1' },
            include: {
                comments: true,
                criteria: true,
                evaluator: true,
                idea: true
            }
        })
    })

    it("deve lançar NotFoundException se a avaliação não for encontrada", async () => {
        mockEvaluation.evaluations.findUnique.mockResolvedValue(null)
        await expect(controller.findOne('9999')).rejects.toThrow(NotFoundException)
    })

    it("deve atualizar uma avaliação por id", async () => {
        const evaluationAtual = {
            id: '1',
            stage: 'VALIDACAO',
            ideaId: '123e4567-e89b-12d3-a456-426614174000',
            evaluatorId: '123e4567-e89b-12d3-a456-426614174001'
        }

        const evaluationAtualizada = {
            id: '1',
            stage: 'GERACAO', 
            ideaId: '123e4567-e89b-12d3-a456-426614174000',
            evaluatorId: '123e4567-e89b-12d3-a456-426614174001'
        }

        mockEvaluation.evaluations.findUnique.mockResolvedValue(evaluationAtual)
        mockEvaluation.evaluations.update.mockResolvedValue({ ...evaluationAtual, ...evaluationAtualizada })
        const result = await mockEvaluation.evaluations.update('1', evaluationAtualizada)
        expect(result.id).toBe('1')
    })

    it("deve lançar NotFoundException ao atualizar avaliação não existente", async () => {
        const evaluationAtualizada = {
            id: '1',
            stage: Stage.GERACAO, 
            ideaId: '123e4567-e89b-12d3-a456-426614174000',
            evaluatorId: '123e4567-e89b-12d3-a456-426614174001'
        }
        jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
        await expect(service.update('9999', evaluationAtualizada)).rejects.toThrow(NotFoundException)
    })

    it("deve deletar uma atualização por id", async () => {
        const evaluation = {
            id: '1',
            stage: 'VALIDACAO',
            ideaId: '123e4567-e89b-12d3-a456-426614174000',
            evaluatorId: '123e4567-e89b-12d3-a456-426614174001'
        }

        mockEvaluation.evaluations.delete.mockResolvedValue(evaluation)
        const result = await service.remove('1')
        expect(result).toEqual(evaluation)
    })

    it("deve lançar NotFoundException ao deletar avaliação não existente", async () => {
        mockEvaluation.evaluations.delete.mockRejectedValue(new NotFoundException('Avaliação não encontrada!'))
        await expect(service.remove('9999')).rejects.toThrow(NotFoundException)
    })
})