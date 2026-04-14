import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from "express";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: false,
      forbidUnknownValues: false,
      disableErrorMessages: false,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  app.enableCors({ methods });

  // Налаштування Swagger ДО встановлення глобального префіксу
  const config = new DocumentBuilder()
    .setTitle("Redvike test task API doc")
    .setVersion("1.0")
    .addTag("redvike")
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  app.setGlobalPrefix('api');

  SwaggerModule.setup("api", app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });


  console.log(`Swagger UI is available at http://localhost:${process.env.PORT ?? 3000}/api/docs`);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
