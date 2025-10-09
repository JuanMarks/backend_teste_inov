import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, IsUUID } from "class-validator"

export class CreatePOCdto {
    @ApiProperty({
        description: 'Título da POC',
        example: 'POC de Integração com API de Pagamentos'
    })
    @IsString()
    title: string

    @ApiProperty({
        description: 'Metas e objetivos que a POC deve atingir',
        example: 'Validar a integração com o gateway de pagamentos X e medir tempo de resposta'
    })
    @IsString()
    targets: string

    @ApiProperty({
        description: 'Prazos definidos para execução da POC',
        example: 'Início: 01/10/2025 - Término: 15/10/2025'
    })
    @IsString()
    deadlines: string

    @ApiProperty({
        description: 'Indicadores de sucesso da POC',
        example: 'Taxa de sucesso ≥ 95%, tempo médio de resposta ≤ 500ms, redução de 20% em falhas nas transações'
    })
    @IsString()
    indicators: string

    @ApiProperty({
        description: 'ID do usuário dono da POC',
        example: 'uuid-do-user'
    })
    @IsUUID()
    userId: string

    @ApiProperty({
        description: 'ID da startup relacionada',
        example: 'uuid-da-startup',
        required: false
    })
    @IsUUID()
    @IsOptional()
    startupID?: string

    @ApiProperty({
        description: 'Lista dos desafios relacionados',
        example: ['uuid-challenge1', 'uuid-challenge2'],
        required: false
    })
    @IsUUID()
    @IsOptional()
    challengesID?: string[]
}