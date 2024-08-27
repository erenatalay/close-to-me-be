import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterRequestDto } from './dto/register-request-auth.dto';
import { AuthRegisterResponseDto } from './dto/register.response-auth.dto';
import { AuthProviderEnum } from './auth.types';
import { HashingService } from 'src/utils/hashing/hashing.module';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  async registerUserService(
    registerUserDto: AuthRegisterRequestDto,
  ): Promise<AuthRegisterResponseDto> {
    try {
      const { firstname, lastname, email, password } = registerUserDto;

      const existingUser = await this.prismaService.users.findUnique({
        where: { email },
      });

      if (existingUser) throw new Error('User already exists');

      const hashedPassword = await this.hashingService.hashPassword(password);

      const user = await this.prismaService.users.create({
        data: {
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: hashedPassword,
          provider: AuthProviderEnum.DEFAULT,
        },
      });

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
        provider: user.provider,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong while registering user',
      );
    }
  }
}
