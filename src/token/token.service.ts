import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async verifyToken(token: string) {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = await this.jwtService.verify(token, { secret });

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async createPasswordResetToken(user: Users) {
    const secret = this.configService.get<string>('JWT_SECRET');
    const passwordResetExpiresIn = this.configService.get<string>(
      'PASSWORD_RESET_EXPIRES_IN',
    );
    return this.jwtService.sign(
      { email: user.email, id: user.id, type: 'passwordReset' },
      { secret, expiresIn: passwordResetExpiresIn },
    );
  }

  async createAccessToken(user: Users) {
    const payload = {
      id: user.id,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });
  }

  async createRefreshToken(user: Users) {
    const payload = { email: user.email };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    let userEmail;
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      userEmail = decoded.email;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.prismaService.users.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.createAccessToken(user);
  }
}
