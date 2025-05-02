import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [PrismaModule, ProductsModule, AuthModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
