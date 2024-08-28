import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformers';

export class GetUserResponseDto {
  @ApiProperty({ example: '1', type: String })
  @IsNotEmpty()
  id: string;
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: 'default' })
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  isActiveAccount: boolean;
}
