import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string | null, dto: CreateOrderDto) {
    if (!userId && !dto.email) {
      throw new BadRequestException('Email requis pour commande invitée');
    }

    const products = await Promise.all(
      dto.items.map((item) =>
        this.prisma.product.findUnique({ where: { id: item.productId } }),
      ),
    );

    const total = dto.items.reduce((sum, item, i) => {
      return sum + (products[i]?.price ?? 0) * item.quantity;
    }, 0);

    return this.prisma.order.create({
      data: {
        userId,
        email: userId ? undefined : dto.email,
        total,
        status: 'PENDING',
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({ include: { items: true } });
  }
}
