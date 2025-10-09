import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CommentableType } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";


export class CreateCommentsDto {
    @ApiProperty({example: 'Ótimo Desafio, recomendo!', description: 'Texto do comentário'})
    @IsString()
    text: string;
    @ApiProperty({example: 'CHALLENGE', description: 'Tipo do item comentável (pode ser um desafio (CHALLENGE) ou ideias (IDEA))'})
    @IsEnum(CommentableType)
    commentableType: CommentableType
    @ApiProperty({example: 'string', description: 'Id do item comentável (pode ser um desafio (CHALLENGE) ou ideias (IDEA))'})
    @IsString()
    commentableId: string
    @ApiPropertyOptional({example: 'string', description: 'Id da avaliação associada ao comentário'})
    @IsOptional()
    @IsString()
    evaluationsId?: string
}