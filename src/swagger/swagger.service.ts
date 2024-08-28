import { Injectable, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class SwaggerService {
  setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API docs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
  }
}
