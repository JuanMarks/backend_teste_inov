import { Test, TestingModule } from '@nestjs/testing'
import { ChallengeService } from './challenge.service'
import { PrismaService } from '../prisma/prisma.service'
import { CreateChallengeDTO } from './dto/create-challenge.dto'
import { ChallengeController } from './challenge.controller'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesOrGuard } from '../auth/rolesOrGuard.guard'
import { GestorGuard } from '../auth/gestor-auth.guard'
import { AvaliadorGuard } from '../auth/avaliador-auth.guard'
import { ComumGuard } from '../auth/comum-auth.guard'
import { ConflictException } from '@nestjs/common'
import { CategoriaChallenges, Status, Tags, TypePublication } from '@prisma/client'
import { Type } from 'class-transformer'

describe('Challenge Service Test', () => {
  let service: ChallengeService
  let prisma: PrismaService
  let controller: ChallengeController

  const mockPrisma = {
    challenges: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengeController],
      providers: [
        ChallengeService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtAuthGuard, useValue: true },
        { provide: RolesOrGuard, useValue: true },
        { provide: GestorGuard, useValue: true },
        { provide: AvaliadorGuard, useValue: true },
        { provide: ComumGuard, useValue: true },
      ],
    }).compile()

    controller = module.get<ChallengeController>(ChallengeController)
    service = module.get<ChallengeService>(ChallengeService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('deve criar um novo desafio', async () => {
    const challenge: CreateChallengeDTO = {
      name: 'Automatização de Vacina',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-09-05'),
      area: 'Tecnologia',
      description: 'Monitoramento das Vacinas da comunidade',
      status: 'PENDENTE',
      typePublication: TypePublication.RESTRITO,
      images: 'https://image.com/vacina.png',
      tags: Tags.IA,
      categoria: CategoriaChallenges.TECNOLOGIA,
    }

    const result = { id: '8838hju3ij8ej9', ...challenge }

    mockPrisma.challenges.create.mockResolvedValue(result)

    const response = await service.create(challenge)

    expect(response).toEqual(result)
    expect(mockPrisma.challenges.create).toHaveBeenCalledWith({
      data: {
        name: challenge.name,
        description: challenge.description,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        area: challenge.area,
        type: challenge.typePublication,
        status: challenge.status,
        images: challenge.images,
        tags: challenge.tags,
        categoria: challenge.categoria,
      },
    })
  })

  it('deve listar todos os desafios paginados', async () => {
    const paginatedChallenges = [
      {
        id: '1',
        name: 'Desafio Público 1',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2025-09-05'),
        area: 'Tecnologia',
        description: 'Descrição do desafio público 1',
        type: TypePublication.PUBLICO,
        status: 'PENDENTE',
        image: 'img1.png',
        tag: 'IA',
        categoria: 'TECNOLOGIA',
      },
      {
        id: '2',
        name: 'Desafio Público 2',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2025-10-05'),
        area: 'Educação',
        description: 'Descrição do desafio público 2',
        type: TypePublication.RESTRITO,
        status: 'ATIVO',
        image: 'img2.png',
        tag: 'INOVAÇÃO',
        categoria: 'EDUCAÇÃO',
      },
    ]

    const totalChallenge = paginatedChallenges.length

    mockPrisma.$transaction.mockResolvedValue([paginatedChallenges, totalChallenge])

    const result = await service.findAllPaginated(1, 10)

    expect(result).toEqual({
      data: paginatedChallenges,
      total: totalChallenge,
      page: 1,
      lastPage: Math.ceil(totalChallenge / 10),
    })
  })

  it('deve listar todos os desafios públicos', async () => {
    const publicChallenges = [
      {
        id: '1',
        name: 'Desafio Público 1',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2025-09-05'),
        area: 'Tecnologia',
        description: 'Descrição do desafio público 1',
        type: TypePublication.PUBLICO,
        status: 'PENDENTE',
        image: 'img1.png',
        tag: 'IA',
        categoria: 'TECNOLOGIA',
      },
      {
        id: '2',
        name: 'Desafio Público 2',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2025-10-05'),
        area: 'Educação',
        description: 'Descrição do desafio público 2',
        type: TypePublication.PUBLICO,
        status: 'ATIVO',
        image: 'img2.png',
        tag: 'SUSTENTABILIDADE',
        categoria: 'EDUCAÇÃO',
      },
    ]
    mockPrisma.challenges.findMany.mockResolvedValue(publicChallenges)

    const result = await service.findByPublic()

    expect(result).toEqual(publicChallenges)
    expect(mockPrisma.challenges.findMany).toHaveBeenCalledWith({
      where: { type: 'PUBLICO' },
    })
  })

  it('deve listar todos os desafios restritos', async () => {
    const restrictedChallenges = [
      {
        id: '1',
        name: 'Desafio Restrito 1',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2025-09-05'),
        area: 'Tecnologia',
        description: 'Descrição do desafio restrito 1',
        type: TypePublication.RESTRITO,
        status: 'PENDENTE',
        image: 'img1.png',
        tag: 'IA',
        categoria: 'TECNOLOGIA',
      },
      {
        id: '2',
        name: 'Desafio Restrito 2',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2025-10-05'),
        area: 'Saúde',
        description: 'Descrição do desafio restrito 2',
        type: TypePublication.RESTRITO,
        status: 'ATIVO',
        image: 'img2.png',
        tag: 'INOVAÇÃO',
        categoria: 'SAÚDE',
      },
    ]

    mockPrisma.challenges.findMany.mockResolvedValue(restrictedChallenges)

    const result = await service.findByRestricted()

    expect(result).toEqual(restrictedChallenges)
    expect(mockPrisma.challenges.findMany).toHaveBeenCalledWith({
      where: { type: 'RESTRITO' },
    })
  })

  it('deve listar desafio por ID', async () => {
    const challenge = {
      id: '1',
      name: 'Automatização de Vacina',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-09-05'),
      area: 'Tecnologia',
      description: 'Monitoramento das Vacinas da comunidade',
      status: 'PENDENTE',
      type: TypePublication.RESTRITO,
      image: 'vacina.png',
      tag: 'IA',
      categoria: 'TECNOLOGIA',
    }
    mockPrisma.challenges.findUnique.mockResolvedValue(challenge)

    expect(await controller.findById('1')).toEqual(challenge)
    expect(mockPrisma.challenges.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    })
  })

  it('deve lançar ConflictException se o desafio não for encontrado', async () => {
    mockPrisma.challenges.findUnique.mockResolvedValue(null)
    await expect(controller.findById('9999')).rejects.toThrow(ConflictException)
  })

  it('deve atualizar desafio por ID', async () => {
    const DesafioAtual = {
      id: '1',
      name: 'Automatização de Vacina 2.0',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-09-05'),
      area: 'Tecnologia',
      description: 'Versão antiga',
      status: 'PENDENTE',
      type: TypePublication.RESTRITO,
      image: 'old.png',
      tag: 'IA',
      categoria: 'TECNOLOGIA',
    }

    const DesafioAtualizado = {
      name: 'Automatização de Vacina Atualizada',
      startDate: new Date('2025-09-10'),
      endDate: new Date('2025-09-15'),
      area: 'Tecnologia',
      description: 'Versão atualizada',
      status: 'ATIVO',
      typePublication: TypePublication.RESTRITO,
      images: 'nova.png',
      tags: 'INOVAÇÃO',
      categoria: 'TECNOLOGIA',
    }

    mockPrisma.challenges.findUnique.mockResolvedValue(DesafioAtual)
    mockPrisma.challenges.update.mockResolvedValue({ ...DesafioAtual, ...DesafioAtualizado })

    const result = await service.update('1', DesafioAtualizado as any)

    expect(result.name).toBe('Automatização de Vacina Atualizada')
    expect(result.images).toBe('nova.png')
    expect(result.tags).toBe('INOVAÇÃO')
    expect(result.categoria).toBe('TECNOLOGIA')
  })

  it('deve lançar ConflictException ao atualizar desafio inexistente', async () => {
    mockPrisma.challenges.findUnique.mockResolvedValue(null)
    const updateData = {
      name: 'Automatização',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-09-05'),
      area: 'Tecnologia',
      description: 'Monitoramento das Vacinas',
      status: Status.PENDENTE,
      typePublication: TypePublication.RESTRITO,
      images: 'nova.png',
      tags: Tags.IA,
      categoria: CategoriaChallenges.TECNOLOGIA,
    }
    await expect(service.update('9999', updateData)).rejects.toThrow(ConflictException)
  })

  it('deve deletar um desafio por ID', async () => {
    const desafio = {
      id: '5',
      name: 'Automatização',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2025-09-05'),
      area: 'Tecnologia',
      description: 'Monitoramento das Vacinas',
      status: 'PENDENTE',
      type: TypePublication.RESTRITO,
      image: 'vacina.png',
      tag: 'IA',
      categoria: 'TECNOLOGIA',
    }
    mockPrisma.challenges.delete.mockResolvedValue(desafio)
    const result = await service.delete('5')
    expect(result).toEqual(desafio)
  })

  it('deve lançar ConflictException ao deletar desafio inexistente', async () => {
    mockPrisma.challenges.delete.mockRejectedValue(new Error('Desafio não encontrado!'))
    await expect(service.delete('9999')).rejects.toThrow(ConflictException)
  })
})
