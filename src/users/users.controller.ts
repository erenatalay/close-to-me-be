import { JwtAuthGuard } from 'src/auth/strategy/auth-guard.strategy';
import { CustomRequest } from 'src/common/request/customRequest';
import { I18nService } from 'src/i18n/i18n.service';
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

@Controller({ path: 'user', version: '1' })
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly i18Service: I18nService,
  ) {}
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
        message: this.i18Service.translate('error.userNotFound.user'),
      });
    }

    const result = await this.usersService.getUserByUuid(userUuid);

    if (!result) {
      throw new NotFoundException({
        message: this.i18Service.translate('error.userNotFound.user'),
      });
    }

    return {
      message: this.i18Service.translate('common.user.info.success'),
      data: result,
    };
  }
}
