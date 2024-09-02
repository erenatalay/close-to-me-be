import { I18nService } from 'src/i18n/i18n.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UuidService } from 'src/utils/uuid/uuid.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { GetUserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uuidService: UuidService,
    private readonly i18nService: I18nService,
  ) {}

  async getUserByUuid(uuid: string): Promise<GetUserResponseDto> {
    if (!(await this.uuidService.validateUuid(uuid))) {
      throw new BadRequestException({
        message: this.i18nService.translate('error.userNotFound.user'),
      });
    }

    const user = await this.prismaService.users.findUnique({
      where: { id: uuid },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        provider: true,
        isActiveAccount: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: this.i18nService.translate('error.userNotFound.user'),
      });
    }

    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      provider: user.provider,
      isActiveAccount: user.isActiveAccount,
    };
  }
}
