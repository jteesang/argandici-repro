import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // désactive le parser JSON global
  });

  // --- Middleware pour le webhook Stripe ---
  app.use('/webhooks/stripe', express.raw({ type: (_req) => true }));

  // --- JSON pour le reste de l'API ---
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.enableCors({
    origin: [
      'http://localhost:4000', // Dev UI
      'https://staging.argandici.com', // Staging
      'https://www.argandici.com' // Production
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validation des DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
