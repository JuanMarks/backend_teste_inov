import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { StartupService } from './startup.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { createStartupDTO } from './dto/create-startup.dto';
import { UpdateStartupDTO } from './dto/update-startup.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GestorGuard } from '../auth/gestor-auth.guard';
import { RolesOrGuard } from '../auth/rolesOrGuard.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('startups')
export class StartupController {
  constructor(private readonly startupService: StartupService) { }

  @Post()
  @ApiOperation({ summary: 'Criar uma startup' })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, description: 'Startup criada com sucesso' })
  @ApiResponse({ status: 500, description: "Erro interno no servidor" })
  create(@Body() data: createStartupDTO) {
    return this.startupService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas startup' })
  @ApiResponse({ status: 200, description: 'Lista de startup retornada com sucesso' })
  @ApiResponse({ status: 404, description: 'Lista de startup não encotrada' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  findAll() {
    return this.startupService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar startup por ID' })
  @ApiResponse({ status: 200, description: 'Startup encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Startup não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  findOne(@Param('id') id: string) {
    return this.startupService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma startup por ID' })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, description: 'Startup atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Startup não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  update(
    @Param('id') id: string,
    @Body() data: UpdateStartupDTO,
  ) {
    return this.startupService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma startup por ID' })
  @ApiResponse({ status: 200, description: 'Startup deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Startup não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor' })
  remove(@Param('id') id: string) {
    return this.startupService.remove(id);
  }
}
