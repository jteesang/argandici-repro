import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ✅ accessible à tous : client connecté OU invité
  @Post()
  @UseGuards(OptionalJwtGuard)
  create(@Req() req, @Body() dto: CreateOrderDto) {
    const userId = req.user?.userId ?? null;
    return this.ordersService.create(userId, dto);
  }

  // 🔐 accessible uniquement aux utilisateurs connectés (admin ou client)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }
}
