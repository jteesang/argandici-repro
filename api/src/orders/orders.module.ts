import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MailModule } from '../mail/mail.module';
import { StripeModule } from '../stripe/stripe.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [MailModule, StripeModule, TelegramModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule { }
