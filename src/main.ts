import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;
  const env = process.env.NODE_ENV || 'development';

  const name = `DARUMA [${env}]`;
  const logger = new Logger(name);

  const options = new DocumentBuilder()
    .setTitle('DARUMA')
    .setDescription('Shared expenses manager')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, '0.0.0.0', () => {
    logger.log(`Started at http://localhost:${port}/api`);
  });
}
bootstrap();
