import { Test, TestingModule } from "@nestjs/testing"
import { CompaniesController } from "./companies.controller"
import { CompaniesService } from "./companies.service"
import { create } from "domain"



describe('CompaniesController', () => {
    let controller : CompaniesController
    let companiesService : jest.Mocked<CompaniesService>
    beforeEach(async () => {
        const mockCompaniesService: jest.Mocked<CompaniesService> = {
            createCompany: jest.fn(),
            getAllCompanies: jest.fn(),
            getCompanyPaginated: jest.fn(),
            getCompanyById: jest.fn(),
            updateCompany: jest.fn(),
            deleteCompany: jest.fn(),
        } as any

        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompaniesController],
            providers: [
                { provide: CompaniesService, useValue: mockCompaniesService },
            ],
        }).compile()

        controller = module.get<CompaniesController>(CompaniesController)
        companiesService = module.get(CompaniesService)
    })

    it("deve criar uma empresa", async () => {
        const dto = {
            name: "Empresa Teste",
            cnpj: "12.345.678/0001-90"
        } as any

        const company = { id: '1', ...dto }
        companiesService.createCompany.mockResolvedValue(company)
        const result = await controller.createCompany(dto)
        expect(result).toEqual(company)
        expect(companiesService.createCompany).toHaveBeenCalledWith(dto)
    })
    
    it("deve retornar todas as empresas", async () => {
        const companies = [{ id: '1', name: "Empresa Teste", cnpj: "12.345.678/0001-90" , createdAt: new Date()}]
        companiesService.getAllCompanies.mockResolvedValue(companies)
        const result = await controller.getAllCompanies()
        expect(result).toEqual(companies)
        expect(companiesService.getAllCompanies).toHaveBeenCalled()
    })

    it("deve retornar uma empresa pelo id", async () => {
        const company = { id: '1', name: "Empresa Teste", cnpj: "12.345.678/0001-90" , createdAt: new Date() }
        companiesService.getCompanyById.mockResolvedValue(company)
        const result = await controller.getCompanyById('1')
        expect(result).toEqual(company)
        expect(companiesService.getCompanyById).toHaveBeenCalledWith('1')
    })

    it("deve retornar empresas paginadas", async () => {
        const paginatedResult = {
            data: [{ id: '1', name: "Empresa Teste", cnpj: "12.345.678/0001-90" ,createdAt: new Date() }],
            total: 1,
            page: 1,
            lastPage: 1
        }
        companiesService.getCompanyPaginated.mockResolvedValue(paginatedResult)
        const result = await controller.getCompanyPaginated('1', '10')
        expect(result).toEqual(paginatedResult)
        expect(companiesService.getCompanyPaginated).toHaveBeenCalledWith(1, 10)
    })

    it("deve atualizar uma empresa", async () => {
        const dto = {
            name: "Empresa Atualizada",
            cnpj: "12.345.678/0001-90"
        } as any

        const company = { id: '1', ...dto }
        companiesService.updateCompany.mockResolvedValue(company)
        const result = await controller.updateCompany('1', dto)
        expect(result).toEqual(company)
        expect(companiesService.updateCompany).toHaveBeenCalledWith('1', dto)
    })

    it("deve deletar uma empresa", async () => {
        const dto = { id: '1', name: "Empresa Teste", cnpj: "12.345.678/0001-90" , createdAt: new Date()} as any
        companiesService.deleteCompany.mockResolvedValue(dto)
        const result = await controller.deleteCompany('1')
        expect(result).toEqual(dto)
        expect(companiesService.deleteCompany).toHaveBeenCalledWith('1')
    })
})