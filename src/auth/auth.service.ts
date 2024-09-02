import { I18nService } from 'src/i18n/i18n.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from 'src/token/token.service';
import { HashingService } from 'src/utils/hashing/hashing.module';
import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { AuthProviderEnum } from './auth.types';
import { AuthLoginRequestDto } from './dto/login-request-auth.dto';
import { AuthLoginResponseDto } from './dto/login.response-auth.dto';
import { AuthRegisterRequestDto } from './dto/register-request-auth.dto';
import { AuthRegisterResponseDto } from './dto/register.response-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly i18nService: I18nService,
  ) {}

  async registerUserService(
    registerUserDto: AuthRegisterRequestDto,
  ): Promise<AuthRegisterResponseDto> {
    const { firstname, lastname, email, password } = registerUserDto;
    const existingUser = await this.prismaService.users.findUnique({
      where: { email },
    });
    if (existingUser)
      throw new UnprocessableEntityException({
        message: this.i18nService.translate('error.user.aldready.exist'),
      });

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
  }

  async loginUserService(
    loginUserDto: AuthLoginRequestDto,
  ): Promise<AuthLoginResponseDto> {
    const { email, password } = loginUserDto;

    const user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: this.i18nService.translate('error.userNotFound.email'),
      });
    }
    const isPasswordValid = await this.hashingService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException({
        message: this.i18nService.translate(
          'error.userNotFound.invalid.password',
        ),
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
