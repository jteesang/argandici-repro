import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private config: ConfigService) {
    const key = this.config.get<string>('STRIPE_SECRET_KEY');
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');

    this.stripe = new Stripe(key, {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createCheckoutSession(
    orderId: string,
    items: { name: string; price: number; quantity: number }[],
    customerEmail?: string,
  ): Promise<string> {
    const successUrl = this.config.get<string>('STRIPE_SUCCESS_URL');
    const cancelUrl = this.config.get<string>('STRIPE_CANCEL_URL');
    if (!successUrl || !cancelUrl) {
      throw new Error('STRIPE_SUCCESS_URL or STRIPE_CANCEL_URL not set');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: { orderId }, // <-- metadata bien injecté
      customer_email: customerEmail, // pour prefill si dispo
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // 🔍 debug pour vérifier la metadata EN DEV
    console.log('[StripeService] session created:', {
      id: session.id,
      metadata: session.metadata,
    });

    return session.url!;
  }
}
