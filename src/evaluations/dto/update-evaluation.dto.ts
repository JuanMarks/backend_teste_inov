import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Stage } from '@prisma/client';

export class UpdateEvaluationDto {
  @ApiPropertyOptional({
    enum: Stage,
    description: 'Nova etapa da avaliação',
    example: Stage.EXPERIMENTACAO,
  })
  @IsEnum(Stage)
  @IsOptional()
  stage?: Stage;
}
