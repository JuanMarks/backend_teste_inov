import { Test, TestingModule } from "@nestjs/testing"
import { ChallengeController } from "./challenge.controller"
import { ChallengeService } from "./challenge.service"
import { CreateChallengeDTO } from "./dto/create-challenge.dto"
import { ComumGuard } from "../auth/comum-auth.guard"
import { AvaliadorGuard } from "../auth/avaliador-auth.guard"
import { GestorGuard } from "../auth/gestor-auth.guard"
import { RolesOrGuard } from "../auth/rolesOrGuard.guard"
import { ConflictException } from "@nestjs/common"
import { CategoriaChallenges, Status, Tags, TypePublication } from "@prisma/client"
import { UpdateChallengeDTO } from "./dto/uptade-challenge.dto"

const mockService = {
  create: jest.fn(),
  findAllPaginated: jest.fn(),
  findByPublic: jest.fn(),
  findByRestricted: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

describe("Challenge Controller Test", () => {
  let controller: ChallengeController
  let service: ChallengeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengeController],
      providers: [
        {
          provide: ChallengeService,
          useValue: mockService,
        },
        { provide: ComumGuard, useValue: true },
        { provide: AvaliadorGuard, useValue: true },
        { provide: GestorGuard, useValue: true },
        { provide: RolesOrGuard, useValue: true },
      ],
    }).compile()

    controller = module.get<ChallengeController>(ChallengeController)
    service = module.get<ChallengeService>(ChallengeService)
  })

  it("deve criar um desafio", async () => {
    const challenge: CreateChallengeDTO = {
      name: "Automatização de Vacina",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-09-05"),
      area: "Tecnologia",
      description: "Monitoramento das Vacinas da comunidade",
      status: "PENDENTE",
      typePublication: "RESTRITO",
      images: "https://image.com/vacina.png",
      tags: "IA",
      categoria: "TECNOLOGIA",
    }
    const result = { id: "5", ...challenge }
    mockService.create.mockResolvedValue(result)
    expect(await controller.create(challenge)).toEqual(result)
    expect(mockService.create).toHaveBeenCalledWith(challenge)
  })

  it("deve listar todos os desafios paginados", async () => {
    const paginatedChallenges = [
      {
        id: "1",
        name: "Desafio Público 1",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2025-09-05"),
        area: "Tecnologia",
        description: "Descrição do desafio público 1",
        type: "PUBLICO",
        status: "PENDENTE",
        images: "https://image.com/img1.png",
        tags: "IA",
        categoria: "TECNOLOGIA",
      },
      {
        id: "2",
        name: "Desafio Público 2",
        startDate: new Date("2025-10-01"),
        endDate: new Date("2025-10-05"),
        area: "Educação",
        description: "Descrição do desafio público 2",
        type: "RESTRITO",
        status: "ATIVO",
        images: "https://image.com/img2.png",
        tags: "EDUCAÇÃO",
        categoria: "EDUCAÇÃO",
      },
    ]
    mockService.findAllPaginated.mockResolvedValue({
      data: paginatedChallenges,
      total: 1,
      page: 1,
      lastPage: 1,
    })
    expect(await controller.findAllPaginated("1", "10")).toEqual({
      data: paginatedChallenges,
      total: 1,
      page: 1,
      lastPage: 1,
    })
    expect(mockService.findAllPaginated).toHaveBeenCalledWith(1, 10)
  })

  it("deve listar todos os desafios públicos", async () => {
    const publicChallenges = [
      {
        id: "1",
        name: "Desafio Público 1",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2025-09-05"),
        area: "Tecnologia",
        description: "Descrição do desafio público 1",
        type: "PUBLICO",
        status: "PENDENTE",
        images: "https://image.com/pub1.png",
        tags: "IA",
        categoria: "TECNOLOGIA",
      },
      {
        id: "2",
        name: "Desafio Público 2",
        startDate: new Date("2025-10-01"),
        endDate: new Date("2025-10-05"),
        area: "Educação",
        description: "Descrição do desafio público 2",
        type: "PUBLICO",
        status: "ATIVO",
        images: "https://image.com/pub2.png",
        tags: "EDUCAÇÃO",
        categoria: "EDUCAÇÃO",
      },
    ]
    mockService.findByPublic.mockResolvedValue(publicChallenges)
    expect(await controller.findByPublic()).toEqual(publicChallenges)
    expect(mockService.findByPublic).toHaveBeenCalled()
  })

  it("deve listar todos os desafios restritos", async () => {
    const restrictedChallenges = [
      {
        id: "1",
        name: "Desafio Restrito 1",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2025-09-05"),
        area: "Tecnologia",
        description: "Descrição do desafio restrito 1",
        type: "RESTRITO",
        status: "PENDENTE",
        images: "https://image.com/res1.png",
        tags: "IA",
        categoria: "TECNOLOGIA",
      },
      {
        id: "2",
        name: "Desafio Restrito 2",
        startDate: new Date("2025-10-01"),
        endDate: new Date("2025-10-05"),
        area: "Educação",
        description: "Descrição do desafio restrito 2",
        type: "RESTRITO",
        status: "ATIVO",
        images: "https://image.com/res2.png",
        tags: "EDUCAÇÃO",
        categoria: "EDUCAÇÃO",
      },
    ]
    mockService.findByRestricted.mockResolvedValue(restrictedChallenges)
    expect(await controller.findByRestricted()).toEqual(restrictedChallenges)
    expect(mockService.findByRestricted).toHaveBeenCalled()
  })

  it("deve listar desafio por ID", async () => {
    const challenge = {
      id: "1",
      name: "Automatização de Vacina",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-09-05"),
      area: "Tecnologia",
      description: "Monitoramento das Vacinas da comunidade",
      status: "PENDENTE",
      typePublication: "RESTRITO",
      images: "https://image.com/vacina.png",
      tags: "IA",
      categoria: "TECNOLOGIA",
    }
    mockService.findById.mockResolvedValue(challenge)
    expect(await controller.findById("1")).toEqual(challenge)
    expect(mockService.findById).toHaveBeenCalledWith("1")
  })

  it("deve lançar ConflictException se o desafio não for encontrado", async () => {
    mockService.findById.mockRejectedValue(new ConflictException())
    await expect(controller.findById("999")).rejects.toThrow(ConflictException)
    expect(mockService.findById).toHaveBeenCalledWith("999")
  })

  it("deve atualizar um desafio por ID", async () => {
    const DesafioAtualizado: UpdateChallengeDTO = {
      name: "Automatização de Vacina",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-09-05"),
      area: "Tecnologia",
      description: "Monitoramento das Vacinas da comunidade",
      status: "PENDENTE",
      typePublication: TypePublication.RESTRITO,
      images: "https://image.com/vacina2.png",
      tags: "IA",
      categoria: "TECNOLOGIA",
    }
    const updated = { id: "1", ...DesafioAtualizado }
    mockService.update.mockResolvedValue(updated)
    expect(await controller.update("1", DesafioAtualizado)).toEqual(updated)
    expect(mockService.update).toHaveBeenCalledWith("1", DesafioAtualizado)
  })

  it("deve lançar ConflictException ao atualizar desafio não existente", async () => {
    mockService.update.mockRejectedValue(new ConflictException())
    const updateData = {
      name: "Automatização",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-09-05"),
      area: "Tecnologia",
      description: "Monitoramento das Vacinas da comunidade",
      status: Status.PENDENTE,
      typePublication: TypePublication.RESTRITO,
      images: "https://image.com/naoexiste.png",
      tags: Tags.IA,
      categoria: CategoriaChallenges.TECNOLOGIA,
    }
    await expect(controller.update("999", updateData)).rejects.toThrow(ConflictException)
  })

  it("deve deletar um desafio por ID", async () => {
    const desafio = {
      id: "5",
      name: "Automatização",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-09-05"),
      area: "Tecnologia",
      description: "Monitoramento das Vacinas da comunidade",
      status: "PENDENTE" as "PENDENTE",
      typePublication: "RESTRITO" as "RESTRITO",
      images: "https://image.com/delete.png",
      tags: "IA",
      categoria: "TECNOLOGIA",
    }
    mockService.delete.mockResolvedValue(desafio)
    expect(await controller.delete("5")).toEqual(desafio)
    expect(mockService.delete).toHaveBeenCalledWith("5")
  })

  it("deve lançar ConflictException ao deletar desafio não existente", async () => {
    mockService.delete.mockRejectedValue(
      new ConflictException("Desafio não encontrado!")
    )
    await expect(service.delete("9999")).rejects.toThrow(ConflictException)
  })
})
