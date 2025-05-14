import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private domainUrl: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService, // ✅ injecte le config service
  ) {
    const key = this.config.get<string>('STRIPE_SECRET_KEY');
    this.domainUrl = this.config.get<string>('DOMAIN_URL') ?? 'http://localhost:4200';

    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }

    this.stripe = new Stripe(key, {
      apiVersion: '2025-04-30.basil',
    });
  }

  async createCheckoutSession(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) throw new NotFoundException('Commande introuvable');
    if (order.status !== 'PENDING') {
      throw new BadRequestException('Commande déjà traitée');
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: order.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(item.product.price * 100),
          product_data: {
            name: item.product.name,
            images: [
              // `https://argandici.com/assets/${item.product.image}`,
              `https://source.unsplash.com/featured/?argan,oil`,
            ],
          },
        },
      })),
      success_url: `${this.domainUrl}/order/success?orderId=${orderId}`,
      cancel_url: `${this.domainUrl}/order/cancel?orderId=${orderId}`,
      metadata: {
        orderId,
      },
    });

    return { url: session.url };
  }
}
