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
      create: jest.fn() as jest.Mock,
      findMany: jest.fn() as jest.Mock,
      findUnique: jest.fn() as jest.Mock,
      update: jest.fn() as jest.Mock,
      delete: jest.fn() as jest.Mock,
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

  it("deve retornar múltiplas startups filtradas por tecnologia", async () => {
    const mockData = [
      {
        id: "1",
        name: "TechAI",
        cnpj: "11.111.111/0001-11",
        segment: "Tecnologia",
        problem: "Baixo uso de IA em processos empresariais",
        technology: "Inteligência Artificial",
        stage: StageStartup.TRACAO,
        location: "São Paulo - SP",
        founders: "Ana Silva",
        pitch: "Plataforma de automação com IA para pequenas empresas",
        links: "https://techai.com.br",
      },
      {
        id: "2",
        name: "VisionBot",
        cnpj: "22.222.222/0001-22",
        segment: "Automação",
        problem: "Falta de inspeção automatizada em fábricas",
        technology: "Visão Computacional",
        stage: StageStartup.IDEACAO,
        location: "Campinas - SP",
        founders: "Lucas Pereira",
        pitch: "Solução de visão computacional para controle de qualidade industrial",
        links: "https://visionbot.com",
      },
    ];

    mockPrismaService.startup.findMany.mockResolvedValue(mockData);

    const result = await service.findByTecnology("Inteligência Artificial");

    expect(prisma.startup.findMany).toHaveBeenCalledWith({
      where: { technology: { contains: "Inteligência Artificial", mode: "insensitive" } },
    });
    expect(result).toEqual(mockData);
  });

  it("deve retornar múltiplas startups filtradas por setor", async () => {
    const mockData = [
      {
        id: "3",
        name: "FinUp",
        cnpj: "33.333.333/0001-33",
        segment: "Financeiro",
        problem: "Dificuldade no controle de gastos pessoais",
        technology: "Fintech",
        stage: StageStartup.TRACAO,
        location: "Curitiba - PR",
        founders: "Mariana Costa",
        pitch: "App que ajuda usuários a gerenciar finanças pessoais via IA",
        links: "https://finup.com.br",
      },
      {
        id: "4",
        name: "PaySmart",
        cnpj: "44.444.444/0001-44",
        segment: "Financeiro",
        problem: "Falta de soluções para pagamentos automatizados",
        technology: "Blockchain",
        stage: StageStartup.TRACAO,
        location: "Florianópolis - SC",
        founders: "Rafael Gomes",
        pitch: "Sistema de pagamentos inteligentes via contratos digitais",
        links: "https://paysmart.com",
      },
    ];

    mockPrismaService.startup.findMany.mockResolvedValue(mockData);

    const result = await service.findBySegment("Financeiro");

    expect(prisma.startup.findMany).toHaveBeenCalledWith({
      where: { segment: { contains: "Financeiro", mode: "insensitive" } },
    });
    expect(result).toEqual(mockData);
  });

  it("deve retornar múltiplas startups filtradas por problema", async () => {
    const mockData = [
      {
        id: "5",
        name: "HealthTrack",
        cnpj: "55.555.555/0001-55",
        segment: "Saúde",
        problem: "Falta de acompanhamento remoto de pacientes crônicos",
        technology: "IoT e Cloud",
        stage: StageStartup.TRACAO,
        location: "Recife - PE",
        founders: "Carla Mendes",
        pitch: "Plataforma para monitoramento remoto de pacientes usando IoT",
        links: "https://healthtrack.com",
      },
      {
        id: "6",
        name: "NutriSmart",
        cnpj: "66.666.666/0001-66",
        segment: "Saúde",
        problem: "Dificuldade em personalizar dietas",
        technology: "Machine Learning",
        stage: StageStartup.TRACAO,
        location: "Porto Alegre - RS",
        founders: "Thiago Almeida",
        pitch: "Aplicativo que cria planos alimentares com base em IA",
        links: "https://nutrismart.com",
      },
    ];

    mockPrismaService.startup.findMany.mockResolvedValue(mockData);

    const result = await service.findByProblem("Saúde");

    expect(prisma.startup.findMany).toHaveBeenCalledWith({
      where: { problem: { contains: "Saúde", mode: "insensitive" } },
    });
    expect(result).toEqual(mockData);
  });


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
