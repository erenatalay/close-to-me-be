import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerService } from './swagger/swagger.service';
import helmet from 'helmet';
import * as hpp from 'hpp';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/error/http-exception-filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import validationOptions from './common/validate/validate-options';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerService = app.get(SwaggerService);
  swaggerService.setupSwagger(app);
  const configService = app.get(ConfigService);
  setupGracefulShutdown({ app });

  const apiPrefix = configService.get<string>('API_PREFIX') || 'api'; // Varsayılan olarak 'api' kullan
  app.setGlobalPrefix(apiPrefix);
  app.enableCors();

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(hpp());
  app.use(compression());
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  const PORT = configService.get<string>('API_PORT', { infer: true });
  await app.listen(PORT);
  Logger.log(`🚀 Application is running on: http://localhost:${PORT}/`);
}
bootstrap();
