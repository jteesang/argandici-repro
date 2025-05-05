import {
  Controller,
  Post,
  Headers,
  Req,
  Res,
  HttpStatus,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Controller('webhooks/stripe')
export class StripeWebhooksController {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeWebhooksController.name);

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY not set in .env');
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-04-30.basil',
    });
  }

  @Post()
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      this.logger.error('STRIPE_WEBHOOK_SECRET not set in .env');
      throw new InternalServerErrorException('Webhook secret not configured');
    }

    let event: Stripe.Event;
    try {
      // req.body must be raw JSON (configured in main.ts)
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (err: any) {
      this.logger.error(
        `❌ Webhook signature verification failed: ${err.message}`,
      );
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object; // <-- cast explicite
      const orderId = session.metadata?.orderId;
      if (!orderId) {
        this.logger.error(
          '❌ checkout.session.completed without metadata.orderId',
        );
        throw new BadRequestException(
          'Missing orderId in Stripe session metadata',
        );
      }

      try {
        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID' },
        });
        this.logger.log(`💰 Order ${orderId} marked as PAID`);
      } catch (dbErr: any) {
        this.logger.error(
          `❌ Failed updating order ${orderId}: ${dbErr.message}`,
        );
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('Database update failed');
      }
    } else {
      this.logger.log(`ℹ️ Ignored Stripe event type: ${event.type}`);
    }

    return res.status(HttpStatus.OK).json({ received: true });
  }
}
