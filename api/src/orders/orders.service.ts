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

    const productIds = dto.items.map((i) => i.productId);

    // ⚠️ Une seule requête pour récupérer tous les produits concernés
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // 🔍 Vérification de disponibilité du stock
    for (const item of dto.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new NotFoundException(`Produit introuvable`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuffisant pour le produit : ${product.name}`,
        );
      }
    }

    // 💰 Calcul du total
    const total = dto.items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      return sum + (product?.price ?? 0) * item.quantity;
    }, 0);

    // 🧾 Création de la commande
    const order = await this.prisma.order.create({
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

    // 📉 Décrémentation du stock
    await Promise.all(
      dto.items.map((item) =>
        this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        }),
      ),
    );

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({ include: { items: true } });
  }
}
