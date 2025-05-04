// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // 🚫 On désactive le bodyParser interne de Nest
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // 1) RAW pour Stripe Webhook — capture brute du corps
  app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));

  // 2) JSON / URLENCODED pour toutes les autres routes
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 3) Pipes globaux (ValidationPipe pour DTO, etc.)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
