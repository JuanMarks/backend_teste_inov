import { IsEmail, IsEnum, IsString, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiAcceptedResponse, ApiProperty } from '@nestjs/swagger';

export class SendInvitationDto {
  @IsEmail()
  @ApiProperty({example: "jjoaoBruno@gmail.com", description: "Email do usuário a ser convidado"})
  email: string;

  @IsEnum(Role)
  @ApiProperty({ enum: Role, example: Role.COMUM, description: "Papel do usuário na empresa (COMUM ou AVALIADOR)",})
  role: Role;

  @IsString()
    @IsOptional() // Torna o campo opcional
    companyId?: string;
}