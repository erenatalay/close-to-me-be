import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerService } from './swagger/swagger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerService = app.get(SwaggerService);
  swaggerService.setupSwagger(app);
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api'; // Varsayılan olarak 'api' kullan
  app.setGlobalPrefix(apiPrefix);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
