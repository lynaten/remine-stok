/*
  Warnings:

  - You are about to drop the column `addressId` on the `Supplier` table. All the data in the column will be lost.
  - Made the column `purchaseOrderId` on table `ChargeRate` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AdjustmentOrder" DROP CONSTRAINT "AdjustmentOrder_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "ChargeRate" DROP CONSTRAINT "ChargeRate_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "TransferOrder" DROP CONSTRAINT "TransferOrder_warehouseIdFrom_fkey";

-- DropForeignKey
ALTER TABLE "TransferOrder" DROP CONSTRAINT "TransferOrder_warehouseIdTo_fkey";

-- AlterTable
ALTER TABLE "AdjustmentOrder" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "adjustmentType" DROP NOT NULL,
ALTER COLUMN "warehouseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ChargeRate" ALTER COLUMN "purchaseOrderId" SET NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseOrder" ALTER COLUMN "supplierId" DROP NOT NULL,
ALTER COLUMN "warehouseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "addressId",
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "contactNo" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TransferOrder" ALTER COLUMN "warehouseIdFrom" DROP NOT NULL,
ALTER COLUMN "warehouseIdTo" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TransferOrder" ADD CONSTRAINT "TransferOrder_warehouseIdFrom_fkey" FOREIGN KEY ("warehouseIdFrom") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferOrder" ADD CONSTRAINT "TransferOrder_warehouseIdTo_fkey" FOREIGN KEY ("warehouseIdTo") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdjustmentOrder" ADD CONSTRAINT "AdjustmentOrder_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChargeRate" ADD CONSTRAINT "ChargeRate_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
