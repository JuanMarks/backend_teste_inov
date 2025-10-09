import { ApiProperty } from "@nestjs/swagger";
import { StatusConnectios } from "@prisma/client";
import { IsArray, IsEnum, IsUUID } from "class-validator";

class HistoryConnection {
    @ApiProperty({
        description: 'Data do Histórico da Conexão',
        example: '2025-08-05'
    })
    date: Date

    @ApiProperty({
        description: 'Ação do Histórico da Conexão',
        example: 'Interesse registrado por Jonas Fortes'
    })
    action: string
}

export class CreateConnectionsDTO {
    @ApiProperty({
        description: 'ID do Desafio',
        example: 'challenge-id'
    })
    @IsUUID()
    challengeID: string

    @ApiProperty({
        description: 'ID da Empresa',
        example: 'company-id'
    })
    @IsUUID()
    companyID: string

    @ApiProperty({
        description: 'ID da Startup',
        example: 'startup-id'
    })
    @IsUUID()
    startupID: string

    @ApiProperty({
        description: 'Status da Conexão',
        example: 'INTERESSE',
        enum: StatusConnectios
    })
    @IsEnum(['INTERESSE', 'PENDENTE', 'NAO_INTERESSE'])
    status: StatusConnectios

    @ApiProperty({
        description: 'Histórico da Conexão',
        type: [HistoryConnection],
        example: [
        {
            date: '2025-08-05',
            action: 'Interesse registrado por Luis Felipe'
        },
        {
            date: '2025-08-05',
            action: 'Conexão aceita por Ninna Hub'
        }
    ]
    })
    @IsArray()
    history: HistoryConnection[]
}