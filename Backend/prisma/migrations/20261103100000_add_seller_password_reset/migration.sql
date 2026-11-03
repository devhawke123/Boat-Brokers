-- AlterTable
ALTER TABLE "Seller" ADD COLUMN "passwordResetToken" TEXT;
ALTER TABLE "Seller" ADD COLUMN "passwordResetExpires" TIMESTAMP(3);
