import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { MailService } from '../mail/mail.service';
import { generateOrderEmailHtml } from '../mail/templates/order-confirmation';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly stripeService: StripeService,
  ) { }

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

    const checkoutUrl = await this.stripeService.createCheckoutSession(
      order.id, // <-- Passez l'ID de la commande
      dto.items.map((item) => ({
        name: productMap.get(item.productId)!.name,
        price: productMap.get(item.productId)!.price,
        quantity: item.quantity,
      })),
    );

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
      const html = generateOrderEmailHtml(order);
      await this.mailService.sendOrderConfirmation(email, html);
    }

    return { ...order, checkoutUrl };
  }

  async updateShipping(orderId: string, dto: UpdateShippingDto) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        shippingProvider: dto.shippingProvider,
        shippingStatus: dto.shippingStatus,
        trackingNumber: dto.trackingNumber,
      },
    });
  }

  async cancel(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }

    const nonCancelableStatuses = ['SHIPPED', 'IN_TRANSIT', 'DELIVERED'];
    if (nonCancelableStatuses.includes(order.shippingStatus)) {
      throw new BadRequestException(
        'Commande déjà expédiée, annulation impossible',
      );
    }

    // ✅ Remettre les stocks
    await Promise.all(
      order.items.map((item) =>
        this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        }),
      ),
    );

    // ✅ Marquer la commande comme annulée
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        shippingStatus: 'CANCELLED',
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({ include: { items: true } });
  }
}
