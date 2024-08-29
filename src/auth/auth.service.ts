import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterRequestDto } from './dto/register-request-auth.dto';
import { AuthRegisterResponseDto } from './dto/register.response-auth.dto';
import { AuthProviderEnum } from './auth.types';
import { HashingService } from 'src/utils/hashing/hashing.module';
import { AuthLoginResponseDto } from './dto/login.response-auth.dto';
import { AuthLoginRequestDto } from './dto/login-request-auth.dto';
import { TokenService } from 'src/token/token.service';
import { UserAlreadyExistsException } from 'src/common/error/custom-exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUserService(
    registerUserDto: AuthRegisterRequestDto,
  ): Promise<AuthRegisterResponseDto> {
    try {
      const { firstname, lastname, email, password } = registerUserDto;
      const existingUser = await this.prismaService.users.findUnique({
        where: { email },
      });
      if (existingUser) throw new UserAlreadyExistsException();

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
      console.log(error);
      throw new InternalServerErrorException(
        'An error occurred, please try again later',
      );
    }
  }

  async loginUserService(
    loginUserDto: AuthLoginRequestDto,
  ): Promise<AuthLoginResponseDto> {
    const { email, password } = loginUserDto;

    const user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }

    const isPasswordValid = await this.hashingService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'invalid',
        },
      });

    const accessToken = await this.tokenService.createAccessToken(user);

    const refreshToken = await this.tokenService.createRefreshToken(user);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstname,
      lastName: user.lastname,
      provider: user.provider,
      accessToken,
      refreshToken,
    };
  }
}
