import { BadRequestException, Body, Controller, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUserDTO';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { File, MulterFile } from "multer";
import { CloudinaryService } from './cloudinary.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private cloudinary: CloudinaryService) { }

  // rota protegida: precisa estar logado (Admin ou Gestor)
  

  //------------------------------------------------------------------------------------------------------------------------------------//

  @Post('register')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 1 }]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Registrar novo Gestor' })
  @ApiBody({
    description: 'Dados para criar um novo usuário Gestor', schema: {
      type: "object",
      required: ["name", "email", "password", "role", "companyId", "avatar"],
      properties: {
        name: { type: "string", example: "Pedro Silva" },
        email: { type: "string", example: "pedro@gmail.com" },
        password: { type: "string", example: "SenhaSegura123" },
        role: { type: "string", enum: ["GESTOR"] },
        companyId: { type: "string", example: "clb123" },
        avatar: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  async register(@Body() dto: CreateUserDto, @Req() req, @UploadedFiles() files: { images?: MulterFile.File[] }) {
    const user = req.user;
    
    const imgUrls = files.images
      ? await Promise.all(
        files.images.map(file => 
          this.cloudinary.uploadImage(file.buffer)
        ),
      ) : []
    
    const dtoWithImages = {
      ...dto,
      avatar: imgUrls
    };
    return this.authService.register(dtoWithImages, user);
  }

  //------------------------------------------------------------------------------------------------------------------------------------//

  @ApiOperation({ summary: 'Login do usuário' })
  @ApiConsumes('application/json')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido, retorna o token JWT.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' }) 
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(dto);
  }


}