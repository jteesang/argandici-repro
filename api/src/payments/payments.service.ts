import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    const key = process.env.STRIPE_SECRET_KEY;
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
              // ✅ En production, décommente ceci :
              // `https://argandici.com/assets/${item.product.image}`,
              `./fiole.jpg`,
            ],
          },
        },
      })),
      success_url: `${process.env.DOMAIN_URL}/order/success?orderId=${orderId}`,
      cancel_url: `${process.env.DOMAIN_URL}/order/cancel?orderId=${orderId}`,
      metadata: {
        orderId,
      },
    });

    return { url: session.url };
  }
}
