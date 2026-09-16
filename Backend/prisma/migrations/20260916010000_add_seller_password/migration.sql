-- Add password (hashed) column to Seller

ALTER TABLE `Seller` ADD COLUMN `password` VARCHAR(191) NULL;
