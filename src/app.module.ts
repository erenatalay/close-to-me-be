import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.contoller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SwaggerModule } from './swagger/swagger.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
        typesOutputPath: join(__dirname, '../src/generated/i18n.generated.ts'),
      }),
      resolvers: [new HeaderResolver(['x-custom-lang'])],
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    SwaggerModule,
    ConfigModule.forRoot({
      isGlobal: true, // .env dosyasını global olarak yükle
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
