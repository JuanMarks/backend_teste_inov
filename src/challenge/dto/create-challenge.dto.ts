import { ApiProperty } from "@nestjs/swagger"
import { CategoriaChallenges, Stage, Status, Tags, TypePublication } from "@prisma/client"
import { IsDate, IsEnum, IsNotEmpty, IsOptional, isString, IsString } from "class-validator"
import { Type } from "class-transformer"

export class CreateChallengeDTO {
    @ApiProperty({
        description: 'Nome do Projeto',
        example: 'Automação de Processos Financeiros'
    })
    @IsString()
    name: string

    @ApiProperty({
        description: 'Data do Início do Projeto',
        example: '2024-01-15'
    })
    @IsDate()
    @Type(() => Date)
    startDate: Date

    @ApiProperty({
        description: 'Data Final do Projeto',
        example: '2024-03-15'
    })
    @IsDate()
    @Type(() => Date)
    endDate: Date

    @ApiProperty({
        description: 'Área do Desafio',
        example: 'FinTech'
    })
    @IsString()
    area: string

    @ApiProperty({
        description: 'Descrição do Projeto',
        example: 'Buscar soluções inovadoras para automatizar processos financeiros internos, reduzindo custos operacionais e aumentando a eficiência.'
    })
    @IsString()
    description: string

    @ApiProperty({
        description: 'Tipo de Publicação do Desafio',
        example: 'RESTRITO',
        enum: TypePublication
    })
    @IsEnum(TypePublication)
    typePublication: TypePublication

    @ApiProperty({
        description: 'Status do Desafio',
        example: 'INATIVO',
        enum: Status
    })
    @IsEnum(Status)
    status: Status

    @ApiProperty({
        description: 'Id da Empresa',
        example: 'companyId-01'
    })
    @IsOptional()
    @IsString()
    companyId?: string

    @ApiProperty({
        description: 'Imagem referente ao Desafio',
        example: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.hostmidia.com.br%2Fblog%2Fo-que-e-tecnologia%2F&psig=AOvVaw0XSk1Oe-yUn3829WlojhNl&ust=1759941600116000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJjdysHDkpADFQAAAAAdAAAAABAE'
    })
    @IsNotEmpty()
    @IsString()
    images: string

    @ApiProperty({
        description: 'Tag referente ao Desafio',
        example: 'IA',
        enum: Tags
    })
    @IsEnum(Tags)
    tags: Tags

    @ApiProperty({
        description: 'Categoria referente ao Desafio',
        example: 'TECNOLOGIA',
        enum: CategoriaChallenges
    })
    @IsEnum(CategoriaChallenges)
    categoria: CategoriaChallenges
}