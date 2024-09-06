import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
} from 'nestjs-i18n';
import { join } from 'path';
import { TrpcModule } from 'trpc-nestjs-adapter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.contoller';
import { AuthModule } from './auth/auth.module';
// import { HealthModule } from './auth/health-check/healthCheck.module';
import { PrismaModule } from './prisma/prisma.module';
import { SwaggerModule } from './swagger/swagger.module';
import { appRouter } from './trpc/trpc.router';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GracefulShutdownModule.forRoot(),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      loader: I18nJsonLoader,
      resolvers: [
        new AcceptLanguageResolver(),
        new HeaderResolver(['Accept-Language']),
      ],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    AuthModule,
    UsersModule,
    PrismaModule,
    SwaggerModule,
    // HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TrpcModule.forRoot({
      path: '/trpc',
      router: appRouter,
      createContext: () => ({}),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
