import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({example: "pedro@gmail.com"})
  email: string;

  @IsNotEmpty()
  @ApiProperty({example: "123456"})
  password: string;
}
