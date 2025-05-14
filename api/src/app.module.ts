import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { MailModule } from './mail/mail.module';
import { PaymentsModule } from './payments/payments.module';
import { StripeModule } from './stripe/stripe.module';
import { StripeController } from './stripe/stripe.controller';
import { StripeWebhooksController } from './webhooks/stripe-webhooks.controller';
import { TelegramModule } from './telegram/telegram.module';
import { PdfModule } from './pdf/pdf.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ injecte ConfigService globalement
    PrismaModule,
    ProductsModule,
    AuthModule,
    OrdersModule,
    MailModule,
    PaymentsModule,
    StripeModule,
    TelegramModule,
    PdfModule,
    SupabaseModule,
  ],
  controllers: [AppController, StripeController, StripeWebhooksController],
  providers: [AppService],
})
export class AppModule { }
