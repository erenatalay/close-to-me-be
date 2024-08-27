import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformers';

export class AuthLoginRequestDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(lowerCaseTransformer)
  @MinLength(2, { message: 'Email must be at least 2 characters long' })
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(2, { message: 'Password must be at least 6 characters long' })
  password: string;
}
