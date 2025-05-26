import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du script de seed...');

  console.log('🧹 Nettoyage des données existantes...');
  await prisma.orderItem.deleteMany({});
  console.log('   🗑️ OrderItems supprimés.');
  await prisma.order.deleteMany({});
  console.log('   🗑️ Orders supprimées.');
  await prisma.product.deleteMany({});
  console.log('   🗑️ Products supprimés.');
  await prisma.user.deleteMany({});
  console.log('   🗑️ Users supprimés.');
  console.log('✅ Nettoyage terminé.');

  console.log('🔑 Hachage des mots de passe...');
  const adminPass = await bcrypt.hash('adminpass', 10);
  const clientPass = await bcrypt.hash('clientpass', 10);
  console.log('✅ Mots de passe hachés.');

  console.log('👤 Création de l\'utilisateur Admin...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@argandici.com',
      password: adminPass,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Utilisateur Admin créé : ${admin.email} (ID: ${admin.id})`);

  console.log("👤 Création de l'utilisateur Client...");
  const client = await prisma.user.create({
    data: {
      email: 'client@argandici.com',
      password: clientPass,
      role: Role.CLIENT,
    },
  });
  console.log(`✅ Utilisateur Client créé : ${client.email} (ID: ${client.id})`);

  console.log('📦 Création des produits...');
  const productsData = [
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
  ];
  await prisma.product.createMany({
    data: productsData,
  });
  console.log(`✅ ${productsData.length} produits créés.`);
  console.log('🎉 Script de seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Une erreur est survenue pendant le script de seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('🔌 Déconnexion de Prisma...');
    await prisma.$disconnect();
    console.log('✅ Déconnexion Prisma effectuée.');
  });
