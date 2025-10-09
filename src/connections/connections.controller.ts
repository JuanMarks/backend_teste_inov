import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ConnectionsService } from "./connections.service";
import { CreateConnectionsDTO } from "./dto/create-connections.dto";
import { UpdateConnectionDTO } from "./dto/update-connections.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesOrGuard } from "../auth/rolesOrGuard.guard";

@UseGuards(JwtAuthGuard, RolesOrGuard)
@ApiBearerAuth()
@Controller('Connections')
export class ConnectionsController {
    constructor(private readonly service: ConnectionsService) { }

    @Post()
    @ApiOperation({ summary: 'Criar uma Conexão' })
    @ApiResponse({ status: 200, description: 'Conexão criada com sucesso' })
    @ApiResponse({ status: 500, description: "Erro interno no servidor" })
    create(@Body() data: CreateConnectionsDTO) {
        return this.service.create(data)
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as conexões' })
    @ApiResponse({ status: 200, description: 'Lista de conexões retornada com sucesso' })
    @ApiResponse({ status: 404, description: 'Lista de conexões não encotrada' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    findMany() {
        return this.service.findMany()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Listar Conexão por ID' })
    @ApiResponse({ status: 200, description: 'Conexão encontrada com sucesso' })
    @ApiResponse({ status: 404, description: 'Conexão não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
    findUnique(@Param('id') id: string) {
        return this.service.findUnique(id)
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar uma Conexão por ID' })
    @ApiResponse({ status: 200, description: 'Conexão atualizada com sucesso' })
    @ApiResponse({ status: 404, description: 'Conexão não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    update(@Param('id') id: string, @Body() data: UpdateConnectionDTO) {
        return this.service.update(id, data)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar uma Conexão por ID' })
    @ApiResponse({ status: 200, description: 'Conexão deletada com sucesso' })
    @ApiResponse({ status: 404, description: 'Conexão não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
    delete(@Param('id') id: string) {
        return this.service.delete(id)
    }
}