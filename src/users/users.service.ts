import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { GetUserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uuidService: UuidService,
  ) {}

  async getUserByUuid(uuid: string): Promise<GetUserResponseDto> {
    if (!(await this.uuidService.validateUuid(uuid))) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: {
          uuid: 'invalid',
        },
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
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          user: 'notFound',
        },
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
