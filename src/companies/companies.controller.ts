import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDTO } from './dto/createCompanyDto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PaginatedDto } from './dto/paginatedCompanyDto';
import { CompaniesService } from './companies.service';


@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
    constructor(private service: CompaniesService) { }

    @Post()
    @ApiOperation({ summary: 'Criar uma nova empresa.' })
    @ApiConsumes('application/json')
    @ApiResponse({ status: 201, description: 'Empresa criada com sucesso.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
    @UseGuards(AdminGuard)
    async createCompany(@Body() data: CreateCompanyDTO) {
        return this.service.createCompany(data);
    }

    @Get()
    @ApiOperation({ summary: 'Obter todas as empresas.' })
    @ApiResponse({ status: 200, description: 'Lista de empresas retornada com sucesso.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
    async getAllCompanies() {
        return this.service.getAllCompanies();
    }

    @Get('paginated')
    @ApiOperation({ summary: 'Obter empresas paginadas.' })
    @ApiResponse({ status: 200, description: 'Lista paginada de empresas retornada com sucesso.', type: PaginatedDto })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
    @ApiQuery({ name: 'page', required: false, description: 'Número da página (padrão: 1)' })
    @ApiQuery({ name: 'limit', required: false, description: 'Número de itens por página (padrão: 10)' })
    async getCompanyPaginated(@Query('page') page: string, @Query('limit') limit: string){
        return this.service.getCompanyPaginated(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10
        )
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter empresa por ID.' })
    @ApiResponse({ status: 200, description: 'Empresa retornada com sucesso.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({ status: 404, description: 'Empresa não encontrada.' })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
    async getCompanyById(@Param("id") id: string) {
        return await this.service.getCompanyById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar empresa por ID.' })
    @ApiConsumes('application/json')
    @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({ status: 404, description: 'Empresa não encontrada.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
    @UseGuards(AdminGuard)
    async updateCompany(@Param("id") id: string, @Body() data: CreateCompanyDTO) {
        return this.service.updateCompany(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar empresa por ID.' })
    @ApiResponse({ status: 200, description: 'Empresa deletada com sucesso.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({ status: 404, description: 'Empresa não encontrada.' })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
    @UseGuards(AdminGuard)
    async deleteCompany(@Param("id") id: string) {
        return this.service.deleteCompany(id);
    }
}
