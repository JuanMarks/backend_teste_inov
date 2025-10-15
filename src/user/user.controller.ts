import { Controller, Delete, Get, Param, Post, Put, Req, UseGuards, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GestorGuard } from '../auth/gestor-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CreateUserDto } from '../auth/dto/createUserDTO';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post()
    @ApiOperation({summary: "Rota de criação de usuário"})
    @ApiResponse({status: 201, description: "Usuário criado com sucesso."})
    create(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto)
    }

    @ApiOperation({summary: "Filtra usuários por empresa"})
    // @UseGuards(GestorGuard)
    @ApiResponse({status: 200, description: "Lista de usuários filtrada por empresa."})
    @ApiResponse({status: 404, description: "Empresa não encontrada."})
    @ApiResponse({status: 401, description: "Não autorizado."})
    @ApiResponse({status: 403, description: "Acesso negado."})
    @ApiResponse({status: 500, description: "Erro interno do servidor."})
    @Get(":companyId")
    filterByCompany(@Param("companyId") companyId: string){
        return this.userService.filterByCompany(companyId)
    }

    @ApiOperation({summary: "Deleta um usuário pelo ID"})
    @UseGuards(AdminGuard)
    @ApiResponse({status: 200, description: "Usuário deletado com sucesso."})
    @ApiResponse({status: 404, description: "Usuário não encontrado."})
    @ApiResponse({status: 401, description: "Não autorizado."})
    @ApiResponse({status: 403, description: "Acesso negado."})
    @ApiResponse({status: 500, description: "Erro interno do servidor."})
    @Delete(":id")
    deleteUser(@Param("id") id: string){
        return this.userService.deleteUser(id)
    }
    
    @ApiOperation({summary: "Remove um usuário da empresa"})
    @UseGuards(GestorGuard)
    @ApiResponse({status: 200, description: "Usuário removido da empresa com sucesso."})
    @ApiResponse({status: 404, description: "Usuário não encontrado."})
    @ApiResponse({status: 401, description: "Não autorizado."})
    @ApiResponse({status: 403, description: "Acesso negado."})
    @ApiResponse({status: 500, description: "Erro interno do servidor."})
    @Put(":id")
    removeUserFromCompany(@Param("id") id: string, @Req() req){
        const {companyId} = req.user
        return this.userService.removeUserFromCompany(id, companyId)
    }
}
