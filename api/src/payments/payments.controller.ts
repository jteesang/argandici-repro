import { Controller, Post, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('checkout/:orderId')
  checkout(@Param('orderId') orderId: string) {
    return this.paymentsService.createCheckoutSession(orderId);
  }
}
