import { Test } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { StartupService } from "./startup.service";
import { ConflictException } from "@nestjs/common";
import { StageStartup } from "@prisma/client";
import { createStartupDTO } from "./dto/create-startup.dto";
import { ComumGuard } from "../auth/comum-auth.guard";
import { AvaliadorGuard } from "../auth/avaliador-auth.guard";
import { GestorGuard } from "../auth/gestor-auth.guard";
import { RolesOrGuard } from "../auth/rolesOrGuard.guard";

describe("StartupService", () => {
  let service: StartupService;
  let prisma: PrismaService;

  const mockPrismaService = {
    startup: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StartupService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        },
        { provide: ComumGuard, useValue: true },
        { provide: AvaliadorGuard, useValue: true },
        { provide: GestorGuard, useValue: true },
        { provide: RolesOrGuard, useValue: true },
      ],
    }).compile();

    service = module.get<StartupService>(StartupService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("deve ser criada uma startup", async () => {
    const createStartupDTO: createStartupDTO = {
      name: 'Xplora',
      cnpj: '00.000.000/0000-00',
      segment: 'TI',
      problem: 'Falta de serviço',
      technology: 'JS',
      stage: StageStartup.IDEACAO,
      location: 'Sobral',
      founders: 'Felipe',
      pitch: 'Pitch da startup',
      links: "",
    };
    const result = { id: 'hsdh89h3', data: createStartupDTO };

    mockPrismaService.startup.create.mockResolvedValue(result)

    const createdStartup = await service.create(createStartupDTO);

    expect(createdStartup).toMatchObject(result);
    expect(mockPrismaService.startup.create).toHaveBeenCalledWith({ data: createStartupDTO });
  });

  it("deve listar todas as startups", async () => {
    const startups = [
      {
        name: 'Startup Criada',
        cnpj: '00.000.000/0000-00',
        segment: 'TI',
        problem: 'Problema exemplo',
        technology: 'JS',
        stage: StageStartup.IDEACAO,
        location: 'Cidade Exemplo',
        founders: 'Fundador Exemplo',
        pitch: 'Pitch exemplo',
        links: 'https://www.google.com',
      },
      {
        name: 'AgroTech Solutions',
        cnpj: '11.111.111/0001-11',
        segment: 'Agro',
        problem: 'Baixa eficiência no uso de recursos agrícolas',
        technology: 'IA e IoT',
        stage: StageStartup.TRACAO,
        location: 'Belo Horizonte - MG',
        founders: 'Maria Souza e João Lima',
        pitch: 'Plataforma inteligente para otimizar o uso de água e insumos no campo.',
        links: 'https://www.agrotech.com.br',
      }
    ]
    mockPrismaService.startup.findMany.mockResolvedValue(startups)
    const result = await service.findAll()
    expect(result).toEqual(startups)
    expect(mockPrismaService.startup.findMany).toHaveBeenCalled()
  });

  it("deve buscar uma startup pelo ID", async () => {
    const startup = {
      id: '1',
      name: 'Startup Criada',
      cnpj: '00.000.000/0000-00',
      segment: 'TI',
      problem: 'Problema exemplo',
      technology: 'JS',
      stage: StageStartup.IDEACAO,
      location: 'Cidade Exemplo',
      founders: 'Fundador Exemplo',
      pitch: 'Pitch exemplo',
      links: 'https://www.google.com',
    }
    mockPrismaService.startup.findUnique.mockResolvedValue(startup)
    expect(await service.findOne('1')).toEqual(startup)
    expect(mockPrismaService.startup.findUnique).toHaveBeenCalledWith({
      where: { id: '1' }
    })
  })

  it("deve lançar ConflictException se a startup não for encontrada", async () => {
    mockPrismaService.startup.findUnique.mockResolvedValue(null)
    await expect(service.findOne('9999')).rejects.toThrow(new ConflictException('Startup não encontrada'))
  })

  it("deve atualizar uma startup", async () => {
    const StartupAtual = {
      id: '1',
      name: 'Startup Criada 2.0',
      cnpj: '00.000.000/0000-00',
      segment: 'TI',
      problem: 'Problema exemplo',
      technology: 'JS',
      stage: StageStartup.IDEACAO,
      location: 'Cidade Exemplo',
      founders: 'Fundador Exemplo',
      pitch: 'Pitch exemplo',
      links: 'https://www.google.com',
    };

    const StartupAtualizada = {
      id: '1',
      name: 'Startup Criada',
      cnpj: '00.000.000/0000-00',
      segment: 'TI',
      problem: 'Problema exemplo',
      technology: 'JS',
      stage: StageStartup.IDEACAO,
      location: 'Cidade Exemplo',
      founders: 'Fundador Exemplo',
      pitch: 'Pitch exemplo',
      links: 'https://www.google.com',
    };
    mockPrismaService.startup.findUnique.mockResolvedValue(StartupAtual)
    mockPrismaService.startup.update.mockResolvedValue({ ...StartupAtual, ...StartupAtualizada })

    const result = await service.update('1', StartupAtualizada)
    expect(result).toEqual({ ...StartupAtual, ...StartupAtualizada })
  });

  it('deve lançar ConflictException ao atualizar startup não existente', async () => {
    mockPrismaService.startup.update.mockRejectedValue(new ConflictException())
    const updateDTO = {
      name: 'Startup Criada',
      cnpj: '00.000.000/0000-00',
      segment: 'TI',
      problem: 'Problema exemplo',
      technology: 'JS',
      stage: StageStartup.IDEACAO,
      location: 'Cidade Exemplo',
      founders: 'Fundador Exemplo',
      pitch: 'Pitch exemplo',
      links: 'https://www.google.com'
    };
    await expect(service.update('999', updateDTO)).rejects.toThrow(ConflictException)
  });

  it("deve remover uma startup", async () => {
    const startupDeleted = {
      id: '1',
      name: 'Startup Criada',
      cnpj: '00.000.000/0000-00',
      segment: 'TI',
      problem: 'Problema exemplo',
      technology: 'JS',
      stage: StageStartup.IDEACAO,
      location: 'Cidade Exemplo',
      founders: 'Fundador Exemplo',
      pitch: 'Pitch exemplo',
      links: 'https://www.google.com'
    }
    mockPrismaService.startup.delete.mockResolvedValue(startupDeleted)
    const result = await service.remove('1')
    expect(result).toEqual(startupDeleted)
  });

  it('deve lançar ConflictException ao deletar startup inexistente', async () => {
    mockPrismaService.startup.delete.mockRejectedValue(new ConflictException('Startup não encontrada'))
    await expect(service.remove('9999')).rejects.toThrow(ConflictException)
  })
})
