import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MailModule } from '../mail/mail.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [MailModule, StripeModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule { }
