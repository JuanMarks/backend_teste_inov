import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Stage } from '@prisma/client';

export class CreateEvaluationDto {
  @ApiProperty({
    enum: Stage,
    description: 'Etapa do processo da avaliação',
    example: Stage.GERACAO,
  })
  @IsEnum(Stage)
  stage: Stage;

  @ApiProperty({
    description: 'ID da ideia que está sendo avaliada',
    example: 'cfd9f7e4-1e4b-4d8f-8127-8e5a9771c7a9',
  })
  @IsString()
  @IsNotEmpty()
  ideaId: string;

  @ApiProperty({
    description: 'ID do avaliador responsável pela avaliação',
    example: '8a3d1e02-9e4a-4ab1-90cd-1c82de11ef77',
  })
  @IsString()
  @IsNotEmpty()
  evaluatorId: string;
}
