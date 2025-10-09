import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { CreateIdeaDto } from './dto/createIdeaDto';
import { UpdateIdeaDto } from './dto/updateIdeaDto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesOrGuard } from 'src/auth/rolesOrGuard.guard';


@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('idea')
export class IdeaController {
    constructor(private ideaService: IdeaService){}

    @Post()
    @UseGuards(RolesOrGuard)
    @ApiOperation({summary: 'Cria uma nova ideia'})
    @ApiConsumes('application/json')
    @ApiBody({type: CreateIdeaDto, description: 'Dados para criar uma nova ideia'})
    @ApiResponse({status: 201, description: 'A ideia foi criada com sucesso.'})
    @ApiResponse({status: 400, description: 'Bad Request.'})
    @ApiResponse({status: 500, description: 'Internal Server Error.'})
    create (@Body() data: CreateIdeaDto){

        const dataIdea = {
            ...data,
            votes: 0
        }
        return this.ideaService.create(dataIdea)
    }

    @Get()
    @UseGuards(RolesOrGuard)
    @ApiOperation({summary: 'Retorna todas as ideias'})
    @ApiResponse({status: 200, description: 'Lista de ideias retornada com sucesso.'})
    @ApiResponse({status: 500, description: 'Internal Server Error.'})
    getAllIdea(){
        return this.ideaService.getAllIdeas()
    }

    @Get(":id")
    @UseGuards(RolesOrGuard)
    @ApiOperation({summary: 'Retorna uma ideia pelo ID'})
    @ApiResponse({status: 200, description: 'Ideia retornada com sucesso.'})
    @ApiResponse({status: 404, description: 'Ideia não encontrada.'})
    @ApiResponse({status: 500, description: 'Internal Server Error.'})
    getIdeaById(@Param("id") id: string){
        return this.ideaService.getIdeaById(id)
    }

    @Put(":id")
    @UseGuards(RolesOrGuard)
    @ApiOperation({summary: 'Atualiza uma ideia pelo ID'})
    @ApiConsumes('application/json')
    @ApiBody({type: UpdateIdeaDto, description: 'Dados para atualizar uma ideia'})
    @ApiResponse({status: 200, description: 'Ideia atualizada com sucesso.'})
    @ApiResponse({status: 404, description: 'Ideia não encontrada.'})
    @ApiResponse({status: 500, description: 'Internal Server Error.'})
    update(@Param("id") id: string, @Body() data: UpdateIdeaDto){
        return this.ideaService.update(id, data)
    }
     
    @Delete(":id")
    @UseGuards(RolesOrGuard)
    @ApiOperation({summary: 'Deleta uma ideia pelo ID'})
    @ApiResponse({status: 200, description: 'Ideia deletada com sucesso.'})
    @ApiResponse({status: 404, description: 'Ideia não encontrada.'})
    @ApiResponse({status: 500, description: 'Internal Server Error.'})
    delete(@Param("id") id: string){
        return this.ideaService.delete(id)
    }
}
