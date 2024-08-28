import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/strategy/auth-guard.strategy';
import { CustomRequest } from 'src/common/request/customRequest';

@Controller({ path: 'user', version: '1' })
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Req() req: CustomRequest) {
    const userUuid = req.user?.id;

    if (!userUuid) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          user: 'notFound',
        },
      });
    }

    const result = await this.usersService.getUserByUuid(userUuid);

    if (!result) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          user: 'notFound',
        },
      });
    }

    return { message: 'User Information retrieved successfully', data: result };
  }
}
