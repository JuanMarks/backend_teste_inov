import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CompleteInvitationsDto {
    @ApiProperty({example: "cwcdwqwaw2kk2mjisn2opq", description: "Token do convite enviado por email"})
    @IsString()
    token: string;
    @ApiProperty({example: "SenhaSegura123!", description: "Senha do usuário a ser criado"})
    @IsString()
    password: string;
    @ApiProperty({example: "João Bruno", description: "Nome do usuário a ser criado"})
    @IsString()
    name: string;
}