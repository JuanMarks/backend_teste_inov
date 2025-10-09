import { Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentsDto } from './dto/createCommentsDto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @Post()
    @ApiOperation({ summary: 'Criar um novo comentário' })
    @ApiConsumes('application/json')
    @ApiBody({ type: CreateCommentsDto })
    @ApiResponse({ status: 201, description: 'Comentário criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
    async create(@Body() data: CreateCommentsDto, @Req() req) {
    const { companyId, id: authorId } = req.user;
    return this.commentsService.create(data, companyId, authorId);
    }

    @Get(':id/:type')
    @ApiOperation({ summary: 'Listar comentários por entidade' })
    @ApiConsumes('application/json')
    @ApiResponse({ status: 200, description: 'Comentários recuperados com sucesso.' })
    @ApiResponse({ status: 404, description: 'Comentários não encontrados.' })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
    findByEntity(@Param("id") id: string, @Param("type") type: string, @Req() req) {
        const {companyId} = req.user;
        return this.commentsService.findByEntity(id, type as any, companyId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar um comentário' })
    @ApiConsumes('application/json')
    @ApiResponse({ status: 200, description: 'Comentário deletado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Comentário não encontrado.' })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
    delete(@Param("id") commentId: string, @Req() req) {
        const {id: authorId, role} = req.user;
        return this.commentsService.delete(commentId, authorId, role);
    }
}
