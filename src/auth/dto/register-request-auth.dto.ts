import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformers';
import { AuthProviderEnum } from '../auth.types';

export class AuthRegisterRequestDto {
  @ApiProperty({ example: 'John', type: String })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  firstname: string;

  @ApiProperty({ example: 'Doe', type: String })
  @IsString({ message: 'Lastname must be a string' })
  @IsNotEmpty({ message: 'Lastname is required' })
  @MinLength(2, { message: 'Lastname must be at least 2 characters long' })
  lastname: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(lowerCaseTransformer)
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(2, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 'default' })
  @IsEnum(AuthProviderEnum, { message: 'Provider must be a valid provider' })
  @IsNotEmpty({ message: 'Provider is required' })
  @MinLength(2, { message: 'Provider must be at least 2 characters long' })
  provider: string;
}
