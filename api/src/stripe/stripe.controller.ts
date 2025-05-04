import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('checkout')
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  @Post()
  async createSession(
    @Body()
    body: {
      orderId: string;
      items: { name: string; price: number; quantity: number }[];
    },
  ) {
    const url = await this.stripeService.createCheckoutSession(
      body.orderId,
      body.items,
    );

    return { url };
  }
}
