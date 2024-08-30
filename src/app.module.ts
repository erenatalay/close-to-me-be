import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.contoller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SwaggerModule } from './swagger/swagger.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
} from 'nestjs-i18n';
import { ThrottlerModule } from '@nestjs/throttler';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { join } from 'path';
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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
