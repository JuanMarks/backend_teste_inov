import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Min } from 'class-validator';

export class PaginatedDto {
  @ApiProperty({
    example: 1,
    description: 'Número da página (mínimo 1)',
  })
  @IsString({ message: 'O campo "page" deve ser um número inteiro.' })
  @Min(1, { message: 'O número da página deve ser pelo menos 1.' })
  page: string;

  @ApiProperty({
    example: 10,
    description: 'Quantidade de itens por página (mínimo 1)',
  })
  @IsString({ message: 'O campo "limit" deve ser um número inteiro.' })
  @Min(1, { message: 'O limite deve ser pelo menos 1.' })
  limit: string;
}