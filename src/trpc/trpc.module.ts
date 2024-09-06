import { I18nHelperModule } from 'src/i18n/i18.module';
import { Module } from '@nestjs/common';
import { ModulesContainer, Reflector } from '@nestjs/core';

import { TrpcService } from './trpc.service';

@Module({
  providers: [TrpcService, Reflector, ModulesContainer, I18nHelperModule],
  exports: [TrpcService],
})
export class TrpcModule {}
