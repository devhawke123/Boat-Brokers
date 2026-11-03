-- AlterTable
ALTER TABLE `Seller` ADD COLUMN `passwordResetToken` TEXT NULL,
    ADD COLUMN `passwordResetExpires` DATETIME(3) NULL;
