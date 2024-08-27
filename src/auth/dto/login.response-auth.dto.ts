import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformers';

export class AuthLoginResponseDto {
  @ApiProperty({ example: '1', type: String })
  @IsNotEmpty()
  id: string;
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'default' })
  @IsNotEmpty()
  provider: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
