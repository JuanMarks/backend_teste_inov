import { Test, TestingModule } from '@nestjs/testing';  
import { CompaniesService } from './companies.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDTO } from './dto/createCompanyDto';
import { UpdateCompany} from './dto/updateCompanyDto';



const mockPrisma = {
  companies: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
};

describe('CompaniesService', () => {
    let service: CompaniesService;
    let prisma: PrismaService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompaniesService,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<CompaniesService>(CompaniesService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it("deve criar uma empresa", async () => {
        const dto: CreateCompanyDTO = {
            name: "Empresa Teste",
        } as any

        const company = { id: 1, ...dto };
        mockPrisma.companies.create.mockResolvedValue(company);
        const result = await service.createCompany(dto);
        expect(result).toEqual(company);
        expect(prisma.companies.create).toHaveBeenCalledWith({ data: dto });
    })

    it("deve retornar todas as empresas", async () => {
        const companies = [{ id: 1, name: "Empresa Teste" }];
        mockPrisma.companies.findMany.mockResolvedValue(companies);
        const result = await service.getAllCompanies();
        expect(result).toEqual(companies);
        expect(prisma.companies.findMany).toHaveBeenCalled();

    })

    it("deve retornar uma empresa pelo id", async () => {
        const company = { id: '1', name: "Empresa Teste" };
        mockPrisma.companies.findUnique.mockResolvedValue(company);
        const result = await service.getCompanyById('1');
        expect(result).toEqual(company);
        expect(prisma.companies.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    })

    it("deve retornar erro se empresa não for encontrada pelo id", async () => {
        mockPrisma.companies.findUnique.mockResolvedValue(null);
        const result = await service.getCompanyById('1');
        expect(result).toBeNull();
        expect(prisma.companies.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    })

    it("deve atualizar uma empresa", async () => {
        const dto: UpdateCompany = { name: "Empresa Atualizada" } as any;
        const company = { id: '1', name: "Empresa Teste" };
        const updatedCompany = { id: '1', ...dto };

        mockPrisma.companies.findUnique.mockResolvedValue(company);
        mockPrisma.companies.update.mockResolvedValue(updatedCompany);

        const result = await service.updateCompany('1', dto);
        expect(result).toEqual(updatedCompany);
        expect(prisma.companies.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(prisma.companies.update).toHaveBeenCalledWith({ where: { id: '1' }, data: dto });
    })

    it("deve retornar erro ao atualizar empresa não encontrada", async () => {
        const dto: UpdateCompany = { name: "Empresa Atualizada" } as any;

        mockPrisma.companies.findUnique.mockResolvedValue(null);

        await expect(service.updateCompany('1', dto)).rejects.toThrowError(Error)
        expect(prisma.companies.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    })

    it("deve deletar uma empresa", async () => {
        const company = { id: '1', name: "Empresa Teste" };
        mockPrisma.companies.delete.mockResolvedValue(company);
        const result = await service.deleteCompany('1');
        expect(result).toEqual(company);
        expect(prisma.companies.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    })
})
