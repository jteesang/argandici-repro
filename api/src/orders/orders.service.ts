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

    // 1. Récupérer et vérifier les produits
    const products = await this.prisma.product.findMany({
      where: { id: { in: dto.items.map((i) => i.productId) } },
    });
    const map = new Map(products.map((p) => [p.id, p]));
    // 🔍 Vérification de disponibilité du stock
    for (const it of dto.items) {
      const prod = map.get(it.productId);
      if (!prod) throw new NotFoundException('Produit introuvable');
      if (prod.stock < it.quantity)
        throw new BadRequestException(
          `Stock insuffisant pour le produit : ${prod.name}`,
        );
    }

    // 2. Créer la commande en PENDING
    const total = dto.items.reduce(
      (sum, it) => sum + map.get(it.productId)!.price * it.quantity,
      0,
    );
    const order = await this.prisma.order.create({
      data: {
        userId,
        email: userId ? undefined : dto.email,
        total,
        status: 'PENDING',
        items: {
          create: dto.items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // 3. Lancer Stripe Checkout
    const checkoutUrl = await this.stripeService.createCheckoutSession(
      order.id,
      order.items.map((it) => ({
        name: it.product.name,
        price: it.product.price,
        quantity: it.quantity,
      })),
      order.email ?? undefined,
    );

    // 4. Décrémenter le stock
    await Promise.all(
      dto.items.map((it) =>
        this.prisma.product.update({
          where: { id: it.productId },
          data: { stock: { decrement: it.quantity } },
        }),
      ),
    );

    // 5. Envoyer email de confirmation
    const email = userId
      ? (await this.prisma.user.findUnique({ where: { id: userId } }))?.email
      : dto.email;
    if (email) {
      const html = generateOrderEmailHtml(order);
      await this.mailService.sendOrderConfirmation(email, html);
    }

    // retour: commande + url de checkout
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
    if (!order) throw new NotFoundException('Commande introuvable');

    const blocked = ['SHIPPED', 'IN_TRANSIT', 'DELIVERED'];
    if (blocked.includes(order.shippingStatus))
      throw new BadRequestException(
        'Commande déjà expédiée, annulation impossible',
      );

    // remonter le stock
    await Promise.all(
      order.items.map((it) =>
        this.prisma.product.update({
          where: { id: it.productId },
          data: { stock: { increment: it.quantity } },
        }),
      ),
    );

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
