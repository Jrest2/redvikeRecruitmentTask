import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from "express";
import { Logger, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { PrismaClientExceptionFilter } from "./prisma/prisma-client-exception.filter";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
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
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(),
    new AllExceptionsFilter(),
  );

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

  logger.log(
    `Swagger UI is available at http://localhost:${process.env.PORT ?? 3000}/api`,
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap().catch((error: unknown) => {
  const logger = new Logger("Bootstrap");
  logger.error(
    "Application failed to start",
    error instanceof Error ? error.stack : undefined,
  );
  process.exit(1);
});
