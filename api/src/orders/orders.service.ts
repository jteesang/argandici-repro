import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { MailService } from '../mail/mail.service';
import { generateOrderEmailHtml } from '../mail/templates/order-confirmation';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

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
      include: {
        items: {
          include: {
            product: true, // ✅ on inclut les infos produit pour chaque item
          },
        },
      },
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

    const email = userId
      ? (await this.prisma.user.findUnique({ where: { id: userId } }))?.email
      : dto.email;

    if (email) {
      //   const itemsList = order.items
      //     .map((i) => `- ${i.quantity} x produit ${i.productId}`)
      //     .join('<br>');

      //   const html = `
      //   <p>Merci pour votre commande !</p>
      //   <p><strong>Commande n°${order.id}</strong></p>
      //   <p>Total : <strong>${order.total}€</strong></p>
      //   <p>Produits :</p>
      //   <p>${itemsList}</p>
      // `;
      const html = generateOrderEmailHtml(order);
      await this.mailService.sendOrderConfirmation(email, html);
    }

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({ include: { items: true } });
  }
}
