import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCompanyDTO {
    @IsString()
    @ApiProperty({example: "Empresa X"})
    name: string;

    @IsString()
    @ApiProperty({example: "12.345.678/0001-90"})
    cnpj: string;
}