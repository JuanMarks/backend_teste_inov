import { ApiProperty } from "@nestjs/swagger"
import { StageStartup } from "@prisma/client"
import { IsEnum, IsString } from "class-validator"

export class createStartupDTO {
    @ApiProperty({
        description: 'Nome da Startup',
        example: 'Xplora'
    })
    @IsString()
    name: string

    @ApiProperty({
        description: 'CNPJ da Startup',
        example: '00.000.000/0000-00'
    })
    @IsString()
    cnpj: string

    @ApiProperty({
        description: 'Segmento da Startup',
        example: 'TI'
    })
    @IsString()
    segment: string

    @ApiProperty({
        description: 'Problema que a startup resolve',
        example: 'Falta de serviço'
    })
    @IsString()
    problem: string

    @ApiProperty({
        description: 'Tecnologia utilizada pela Startup',
        example: 'JS'
    })
    @IsString()
    technology: string

    @ApiProperty({
        description: 'Estágio da Startup',
        example: 'IDEACAO',
        enum: StageStartup
    })
    @IsEnum(StageStartup)
    stage: StageStartup

    @ApiProperty({
        description: 'Localização da Startup',
        example: 'Sobral'
    })
    @IsString()
    location: string

    @ApiProperty({
        description: 'Fundadores da Startup',
        example: 'Felipe'
    })
    @IsString()
    founders: string

    @ApiProperty({
        description: 'Pitch da Startuo',
        example: 'video'
    })
    @IsString()
    pitch: string

    @ApiProperty({
        description: 'Links referentes a startup',
        example: 'https://google.com'
    })
    @IsString()
    links: string
}