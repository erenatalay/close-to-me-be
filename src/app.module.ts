import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.contoller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SwaggerModule } from './swagger/swagger.module';

@Module({
  imports: [
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
