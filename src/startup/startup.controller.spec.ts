import { Test, TestingModule } from '@nestjs/testing';
import { StartupController } from './startup.controller';
import { StartupService } from './startup.service';
import { ConflictException } from '@nestjs/common';
import { createStartupDTO } from './dto/create-startup.dto';
import { UpdateStartupDTO } from './dto/update-startup.dto';
import { StageStartup } from '@prisma/client';
import { ComumGuard } from '../auth/comum-auth.guard';
import { AvaliadorGuard } from '../auth/avaliador-auth.guard';
import { GestorGuard } from '../auth/gestor-auth.guard';
import { RolesOrGuard } from '../auth/rolesOrGuard.guard';

const mockPrisma = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findByTecnology: jest.fn(),
  findBySegment: jest.fn(),
  findByProblem: jest.fn(),
};

describe('Startup Controller Test', () => {
  let controller: StartupController;
  let service: StartupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StartupController],
      providers: [
        {
          provide: StartupService,
          useValue: mockPrisma,
        },
        { provide: ComumGuard, useValue: true },
        { provide: AvaliadorGuard, useValue: true },
        { provide: GestorGuard, useValue: true },
        { provide: RolesOrGuard, useValue: true },
      ],
    }).compile();

    controller = module.get<StartupController>(StartupController);
    service = module.get<StartupService>(StartupService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar uma startup', async () => {
    const dto: createStartupDTO = {
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
    const result = { id: '1', ...dto };
    mockPrisma.create.mockResolvedValue(result);

    expect(await controller.create(dto)).toEqual(result);
    expect(mockPrisma.create).toHaveBeenCalledWith(dto);
  });

  it('deve listar todas startups', async () => {
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
        pitch:
          'Plataforma inteligente para otimizar o uso de água e insumos no campo.',
        links: 'https://www.agrotech.com.br',
      },
    ];
    mockPrisma.findAll.mockResolvedValue(startups);

    const result = await controller.findAll();
    expect(result).toEqual(startups);
    expect(mockPrisma.findAll).toHaveBeenCalled();
  });

  it('deve buscar uma startup por ID', async () => {
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
    };
    mockPrisma.findOne.mockResolvedValue(startup);

    expect(await controller.findOne('1')).toEqual(startup);
    expect(mockPrisma.findOne).toHaveBeenCalledWith('1');
  });

  it('deve lançar ConflictException se a startup não for encontrada', async () => {
    mockPrisma.findOne.mockRejectedValue(new ConflictException());
    await expect(controller.findOne('999')).rejects.toThrow(ConflictException);
    expect(mockPrisma.findOne).toHaveBeenCalledWith('999');
  });

  it('deve atualizar uma startup', async () => {
    const updateDTO: UpdateStartupDTO = {
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
    const updatedStartup = { id: 1, ...updateDTO };
    mockPrisma.update.mockResolvedValue(updatedStartup);

    expect(await controller.update('1', updateDTO)).toEqual(updatedStartup);
    expect(mockPrisma.update).toHaveBeenCalledWith('1', updateDTO);
  });

  it('deve lançar ConflictException ao atualizar startup não existente', async () => {
    mockPrisma.update.mockRejectedValue(new ConflictException());
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
      links: 'https://www.google.com',
    };
    await expect(controller.update('999', updateDTO)).rejects.toThrow(
      ConflictException,
    );
  });

  it('deve remover uma startup por ID', async () => {
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
      links: 'https://www.google.com',
    };
    mockPrisma.remove.mockResolvedValue(startupDeleted);

    expect(await controller.remove('1')).toEqual(startupDeleted);
    expect(mockPrisma.remove).toHaveBeenCalledWith('1');
  });

  it('deve lançar ConflictException ao deletar startup não existente', async () => {
    mockPrisma.remove.mockRejectedValue(
      new ConflictException('Startup não encontrada!'),
    );
    await expect(service.remove('9999')).rejects.toThrow(ConflictException);
  });

  // 🔍 TESTES COMPLEMENTARES — FILTROS PERSONALIZADOS

  it('deve retornar startups filtradas por tecnologia', async () => {
    const mockData = [{ id: '1', name: 'AI Boost', technology: 'IA' }];
    mockPrisma.findByTecnology.mockResolvedValue(mockData);

    const result = await controller.findByTecnology('IA');
    expect(result).toEqual(mockData);
    expect(mockPrisma.findByTecnology).toHaveBeenCalledWith('IA');
  });

  it('deve retornar startups filtradas por setor', async () => {
    const mockData = [{ id: '2', name: 'FinStart', segment: 'Financeiro' }];
    mockPrisma.findBySegment.mockResolvedValue(mockData);

    const result = await controller.findBySector('Financeiro');
    expect(result).toEqual(mockData);
    expect(mockPrisma.findBySegment).toHaveBeenCalledWith('Financeiro');
  });

  it('deve retornar startups filtradas por problema', async () => {
    const mockData = [{ id: '3', name: 'HealthUp', problem: 'Saúde' }];
    mockPrisma.findByProblem.mockResolvedValue(mockData);

    const result = await controller.findByProblem('Saúde');
    expect(result).toEqual(mockData);
    expect(mockPrisma.findByProblem).toHaveBeenCalledWith('Saúde');
  });
});
