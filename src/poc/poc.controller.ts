import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { POCService } from "./poc.service";
import { CreatePOCdto } from "./dto/create-poc.dto";
import { UpdatePocDTO } from "./dto/update-poc.dto";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { GestorGuard } from "../auth/gestor-auth.guard";
import { RolesOrGuard } from "src/auth/rolesOrGuard.guard";

@UseGuards(JwtAuthGuard, RolesOrGuard)
@ApiBearerAuth()
@Controller('POC')
export class POCController {
    constructor(private readonly service: POCService) { }

    @Post()
    @ApiOperation({ summary: 'Criar uma POC' })
    @ApiConsumes('application/json')
    @ApiResponse({ status: 200, description: 'POC criada com sucesso' })
    @ApiResponse({ status: 500, description: "Erro interno no servidor" })
    create(@Body() data: CreatePOCdto) {
        return this.service.create(data)
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas POC' })
    @ApiResponse({ status: 200, description: 'Lista de POC retornada com sucesso' })
    @ApiResponse({ status: 404, description: 'Lista de POC não encotrada' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    findAll() {
        return this.service.findAll()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Listar POC por ID' })
    @ApiResponse({ status: 200, description: 'POC encontrada com sucesso' })
    @ApiResponse({ status: 404, description: 'POC não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
    findUnique(@Param('id') id: string) {
        return this.service.findUnique(id)
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar uma POC por ID' })
    @ApiConsumes('application/json')
    @ApiResponse({ status: 200, description: 'POC atualizada com sucesso' })
    @ApiResponse({ status: 404, description: 'POC não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    update(@Param('id') id: string, @Body() data: UpdatePocDTO) {
        return this.service.update(id, data)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar uma POC por ID' })
    @ApiResponse({ status: 200, description: 'POC deletada com sucesso' })
    @ApiResponse({ status: 404, description: 'POC não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    delete(@Param('id') id: string) {
        return this.service.delete(id)
    }
}