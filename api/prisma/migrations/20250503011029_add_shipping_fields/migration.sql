-- CreateEnum
CREATE TYPE "ShippingProvider" AS ENUM ('COLISSIMO', 'MONDIAL_RELAY', 'LA_POSTE', 'CHRONOPOST');

-- CreateEnum
CREATE TYPE "ShippingStatus" AS ENUM ('PREPARING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingProvider" "ShippingProvider",
ADD COLUMN     "shippingStatus" "ShippingStatus" NOT NULL DEFAULT 'PREPARING',
ADD COLUMN     "trackingNumber" TEXT;
