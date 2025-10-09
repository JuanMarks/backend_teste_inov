import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CreateChallengeDTO } from "./dto/create-challenge.dto";
import { ChallengeService } from "./challenge.service";
import { UpdateChallengeDTO } from "./dto/uptade-challenge.dto";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesOrGuard } from "../auth/rolesOrGuard.guard";

@UseGuards(JwtAuthGuard, RolesOrGuard)
@ApiBearerAuth()
@Controller('challenges')
export class ChallengeController {
    constructor (private readonly challengeService: ChallengeService) {}

    @Post()
    @ApiOperation({ summary: 'Criar um novo desafio '})
    @ApiConsumes('application/json')
    @ApiResponse({status: 200, description: 'Desafio criado com sucesso'})
    @ApiResponse({status: 404, description: 'Desafio não encontrado'})
    @ApiResponse({status: 500, description: 'Erro interno no servidor'})
    create(@Body() dto: CreateChallengeDTO) {
        return this.challengeService.create(dto)
    }

    @Get('findAllPaginated')
    @ApiOperation({ summary: 'Listar todos os desafios paginados'})
    @ApiResponse({status: 200, description: 'Lista de desafios paginada retornada com sucesso'})
    @ApiResponse({status: 404, description: 'Desafios não encontrado'})
    @ApiResponse({status: 500, description: 'Erro interno no servidor'})
    findAllPaginated(@Query('page') page: string, @Query('limit') limit: string) {
        return this.challengeService.findAllPaginated(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10,
        )
    }

    @Get('findByPublic')
    @ApiOperation({ summary: 'Listar os desafios públicos '})
    @ApiResponse({status: 200, description: 'Lista de desafios públicos retornado com sucesso'})
    @ApiResponse({status: 404, description: 'Desafios não encontrado'})
    @ApiResponse({status: 500, description: 'Erro interno no servidor'})
    findByPublic(){
        return this.challengeService.findByPublic()
    }

    @Get('findByRestricted')
    @ApiOperation({ summary: 'Listar os desafios restritos '})
    @ApiResponse({status: 200, description: 'Lista de desafios restritos retornado com sucesso'})
    @ApiResponse({status: 404, description: 'Desafio não encontrado'})
    @ApiResponse({status: 500, description: 'Erro interno no servidor'})
    findByRestricted(){
        return this.challengeService.findByRestricted()
    }

    @Get(':id')
    @ApiOperation({ summary: 'Listar o desafio por id '})
    @ApiResponse({status: 200, description: 'Desafio encontrado com sucesso'})
    @ApiResponse({status: 404, description: 'Desafio não encontrado'})
    @ApiResponse({status: 500, description: 'Erro interno no servidor'})
    findById(@Param('id') id: string){
        return this.challengeService.findById(id)
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar um desafio por ID '})
    @ApiConsumes('application/json')
    @ApiResponse({status: 200, description: 'Desafio atualizado com sucesso'})
    @ApiResponse({status: 400, description: 'Dados inválidos'})
    @ApiResponse({status: 404, description: 'Desafio não encontrado'})
    @ApiResponse({status: 500, description: 'Erro interno no servidor'})
    update(@Param('id') id: string, @Body() dto: UpdateChallengeDTO) {
        return this.challengeService.update(id, dto)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar um desafio por ID '})
    @ApiResponse({status: 200, description: 'Desafio deletado com sucesso'})
    @ApiResponse({status: 404, description: 'Desafio não encontrado'})
    @ApiResponse({status: 500, description: 'Erro interno no servidor'})
    delete(@Param('id') id: string) {
        return this.challengeService.delete(id)
    }
}