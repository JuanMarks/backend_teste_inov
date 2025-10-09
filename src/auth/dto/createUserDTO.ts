import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { JsonArray } from '@prisma/client/runtime/library';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Pedro Silva' })
  name: string;

  @IsEmail()
  @ApiProperty({example: "pedro@gmail.com"})
  email: string;

  @MinLength(6)
  @ApiProperty({example: "123456"})
  password: string;

  @IsOptional()
  @ApiProperty({ example: 'companyId123', required: false })
  companyId?: string;

  @IsEnum(Role)
  @ApiProperty({ example: 'COMUM', enum: Role })
  role: Role; // USUARIO, AVALIADOR, GESTOR
}