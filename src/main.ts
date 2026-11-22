import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.enableCors({ origin: true, credentials: true, methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Accept','Authorization'] });
  const config = new DocumentBuilder().setTitle('MediConnect API').setDescription('MediConnect healthcare platform API').setVersion('1.0').addBearerAuth().build();
  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, config));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
