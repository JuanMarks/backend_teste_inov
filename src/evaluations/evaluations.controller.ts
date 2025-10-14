import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { AvaliadorGuard } from 'src/auth/avaliador-auth.guard';
import { GestorGuard } from 'src/auth/gestor-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Evaluations') // Nome do grupo no Swagger
@ApiBearerAuth() // Mostra o campo "Authorize" (para JWT)
@Controller('evaluations')
@UseGuards(JwtAuthGuard, GestorGuard)
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova avaliação' })
  @ApiResponse({ status: 201, description: 'Avaliação criada com sucesso.' })
  create(@Body() dto: CreateEvaluationDto) {
    return this.evaluationsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as avaliações' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso.' })
  findAll() {
    return this.evaluationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma avaliação pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação encontrada.' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.evaluationsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma avaliação existente' })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação atualizada com sucesso.' })
  update(@Param('id') id: string, @Body() dto: UpdateEvaluationDto) {
    return this.evaluationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta uma avaliação' })
  @ApiParam({ name: 'id', description: 'ID da avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação deletada com sucesso.' })
  remove(@Param('id') id: string) {
    return this.evaluationsService.remove(id);
  }
}
