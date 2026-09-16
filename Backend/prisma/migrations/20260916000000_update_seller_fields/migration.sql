-- Add sellerId (unique, generated), location, joiningDate to Seller; drop createdAt

ALTER TABLE `Seller` ADD COLUMN `sellerId` VARCHAR(191) NULL;
ALTER TABLE `Seller` ADD COLUMN `location` VARCHAR(191) NULL;
ALTER TABLE `Seller` ADD COLUMN `joiningDate` DATETIME(3) NULL;

-- Backfill existing rows with a generated id and a joiningDate from createdAt
UPDATE `Seller` SET `sellerId` = CONCAT('SEL-', LPAD(`id`, 6, '0')) WHERE `sellerId` IS NULL;
UPDATE `Seller` SET `joiningDate` = `createdAt` WHERE `joiningDate` IS NULL;

ALTER TABLE `Seller` MODIFY COLUMN `sellerId` VARCHAR(191) NOT NULL;
ALTER TABLE `Seller` MODIFY COLUMN `joiningDate` DATETIME(3) NOT NULL;

ALTER TABLE `Seller` ADD UNIQUE INDEX `Seller_sellerId_key` (`sellerId`);

ALTER TABLE `Seller` DROP COLUMN `createdAt`;
