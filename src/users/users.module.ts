import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { HashingService } from 'src/utils/hashing/hashing.module';
import { UuidModule } from 'src/utils/uuid/uuid.module';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, UuidModule],
  controllers: [UsersController],
  providers: [UsersService, HashingService],
  exports: [UsersService],
})
export class UsersModule {}
