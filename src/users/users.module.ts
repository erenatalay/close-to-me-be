import { I18nHelperModule } from 'src/i18n/i18.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HashingService } from 'src/utils/hashing/hashing.module';
import { UuidModule } from 'src/utils/uuid/uuid.module';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, UuidModule, I18nHelperModule],
  controllers: [UsersController],
  providers: [UsersService, HashingService],
  exports: [UsersService],
})
export class UsersModule {}
