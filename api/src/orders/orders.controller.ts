import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/roles.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  // ✅ accessible à tous : client connecté OU invité
  @Post()
  @UseGuards(OptionalJwtGuard)
  create(@Req() req, @Body() dto: CreateOrderDto) {
    const userId = req.user?.userId ?? null;
    return this.ordersService.create(userId, dto);
  }

  // 🔐 accessible uniquement aux utilisateurs connectés (admin ou client)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.ordersService.findAll();
  }

  // 🔐 accessible uniquement aux admin
  @Patch(':id/shipping')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateShipping(@Param('id') id: string, @Body() dto: UpdateShippingDto) {
    return this.ordersService.updateShipping(id, dto);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(id);
  }
}
