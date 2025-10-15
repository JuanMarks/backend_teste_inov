import {
    Body,
    Controller,
    Post,
    Get,
    Query,
    UseGuards,
    Req,
    Delete,
    Param
  } from '@nestjs/common';
  import { InvitationsService } from './invitations.service';
  import { SendInvitationDto } from './dto/sendInvitationsDTO';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GestorGuard } from '../auth/gestor-auth.guard';
import { CompleteInvitationsDto } from './completeInvitationsDto';
import { BadRequestException, ForbiddenException } from '@nestjs/common/exceptions';


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Controller('invitations')
  export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) {}
    
    // Endpoint para enviar convite
    @Post()
    @ApiOperation({ summary: 'Enviar convite para novo usuário' })
    @ApiConsumes('application/json')
    @ApiBody({ 
      type: SendInvitationDto ,
      description: 'Dados para enviar convite (apenas GESTOR pode enviar convites)',
      schema: {
        type: "object",
        required: ["email", "role", "companyId"],
        properties: {
          email: {type: "string", example: "bia@gmail.com"},
          role: {type: "string", enum: ["AVALIADOR", "COMUM"]}
        }
      }
    })
    @ApiResponse({ status: 201, description: 'Convite enviado com sucesso.' })
    @ApiResponse({ status: 403, description: 'Forbidden. Apenas usuários com papel GESTOR podem enviar convites.' })
    @ApiResponse({ status: 400, description: 'Bad Request. Dados inválidos ou convite já enviado.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error. Erro ao enviar o convite.' })
    // @UseGuards(GestorGuard)
    async sendInvitation(@Body() data: SendInvitationDto, @Req() req) {
        const user = req.user;
        let companyIdToSend: string;

        if (user.role === 'GESTOR') {
            companyIdToSend = user.companyId;
        } else if (user.role === 'ADMIN') {
            if (!data.companyId) { // Se for admin, o companyId tem de vir no body
                throw new BadRequestException('Admin deve especificar um companyId para o convite.');
            }
            companyIdToSend = data.companyId;
        } else {
            throw new ForbiddenException('Apenas gestores ou administradores podem enviar convites.');
        }

        return this.invitationsService.sendInvitation(data, companyIdToSend);
    }
  
    // Endpoint para validar convite (frontend pode chamar antes de exibir formulário)
    @Get('validate')
    @ApiOperation({ summary: 'Validar token de convite' })
    @ApiResponse({ status: 200, description: 'Token válido.' })
    @ApiResponse({ status: 400, description: 'Bad Request. Token inválido ou expirado.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error. Erro ao validar o token.' })
    async validateInvitation(@Query('token') token: string) {
      return this.invitationsService.validateInvitation(token);
    }
  
    // Endpoint para completar convite e criar usuário
    @ApiOperation({ summary: 'Completar convite e criar usuário' })
    @ApiConsumes('application/json')
    @ApiBody({ 
      type: CompleteInvitationsDto, 
      description: 'Dados para completar o convite e criar o usuário',
      schema: {
        type: "object",
        required: ["token", "name", "password"],
        properties: {
          token: {type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."},
          name: {type: "string", example: "Beatriz Costa"},
          password: {type: "string", example: "SenhaForte456"},
        }
      } 
    })
    @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Bad Request. Dados inválidos ou token inválido/expirado.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error. Erro ao completar o convite.' })
    @Post('complete')
    async completeInvitation(@Body() data: CompleteInvitationsDto,) {
      return this.invitationsService.completeInvitation(data);
    }

    @Delete(':id')
    async deleteInvitation(@Param('id') id: string) {
      return this.invitationsService.deleteInvitation(id);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os convites' })
    @ApiResponse({ status: 200, description: 'Lista de convites retornada com sucesso.' })
    async getAllInvitations() {
      return this.invitationsService.getAllInvitations();
    }
  
  }