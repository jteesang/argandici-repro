import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  /**
   * Récupère tous les produits (avec id, name, price, description, image, stock, category, createdAt).
   */
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

  /**
   * Récupère un seul produit par son id, avec les mêmes champs que findAll.
   * (On retire ici details/benefits/usage/ingredients car ils n'existent plus dans schema.prisma.)
   */
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
        createdAt: true,
      }
    });
  }

  /**
   * Récupère tous les produits d'une catégorie donnée.
   */
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

  /**
   * Met à jour le stock d'un produit (pour le PATCH /products/:id/stock).
   */
  updateStock(productId: string, stock: number) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { stock },
    });
  }
}
