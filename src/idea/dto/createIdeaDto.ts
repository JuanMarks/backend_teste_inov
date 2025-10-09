import { ApiProperty } from "@nestjs/swagger"
import { Priority, Stage } from "@prisma/client"
import { IsEnum, IsString } from "class-validator"


export class CreateIdeaDto {
    @ApiProperty({description: "Título da Ideia", example: "Plataforma de Gestão de Tarefas"})
    @IsString()
    title: string
    @ApiProperty({description: "Descrição da Ideia", example: "Uma plataforma para gerenciar tarefas e projetos de forma eficiente."})
    @IsString()
    description: string
    @ApiProperty({description: "Etapa do funil",example: "GERACAO", enum: Stage})
    @IsEnum(Stage)
    stage: Stage
    @ApiProperty({description: "Prioridade da Ideia", example: "MEDIA", enum: Priority})
    @IsEnum( Priority )
    priority: Priority
    @ApiProperty({description: "ID do Autor da Ideia", example: "uuid"})
    @IsString()
    authorId: string
    @ApiProperty({description: "ID da Empresa", example: "uuid"})
    @IsString()
    companyId: string
    @ApiProperty({description: "ID do Desafio relacionado", example: "uuid"})
    @IsString()
    challengeId: string
}