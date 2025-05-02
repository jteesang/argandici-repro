import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const adminPass = await bcrypt.hash('adminpass', 10);
  const clientPass = await bcrypt.hash('clientpass', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@argandici.com',
      password: adminPass,
      role: Role.ADMIN,
    },
  });

  const client = await prisma.user.create({
    data: {
      email: 'client@argandici.com',
      password: clientPass,
      role: Role.CLIENT,
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Huile d'argan pure 100ml",
        price: 19.99,
        description: "Huile d'argan 100% pure, pressée à froid.",
        image: 'argan100.jpg',
        stock: 50,
      },
      {
        name: "Huile d'argan cosmétique 250ml",
        price: 34.9,
        description: 'Parfaite pour les soins de la peau et des cheveux.',
        image: 'argan250.jpg',
        stock: 30,
      },
      {
        name: 'Pack découverte 3x50ml',
        price: 29.9,
        description: 'Idéal pour offrir ou tester.',
        image: 'arganpack.jpg',
        stock: 20,
      },
      {
        name: "Savon à l'huile d'argan",
        price: 8.5,
        description: "Savon naturel enrichi à l'huile d'argan.",
        image: 'savon.jpg',
        stock: 40,
      },
    ],
  });

  console.log({ admin, client });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
