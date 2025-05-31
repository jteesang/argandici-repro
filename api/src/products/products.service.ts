import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  findAll() {
    return this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        image: true,
        stock: true,
        category: true,
        createdAt: true,
      }
    });
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        image: true,
        stock: true,
        category: true,
        details: true,
        benefits: true,
        usage: true,
        ingredients: true,
        createdAt: true,
      }
    });
  }

  findByCategory(category: string) {
    return this.prisma.product.findMany({
      where: { category },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        image: true,
        stock: true,
        category: true,
        createdAt: true,
      }
    });
  }

  updateStock(productId: string, stock: number) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { stock },
    });
  }
}
