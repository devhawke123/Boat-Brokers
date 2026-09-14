-- Rename Broker -> Seller and Boat.brokerId -> Boat.sellerId without data loss

ALTER TABLE `Boat` DROP FOREIGN KEY `Boat_brokerId_fkey`;

RENAME TABLE `Broker` TO `Seller`;
ALTER TABLE `Seller` RENAME INDEX `Broker_email_key` TO `Seller_email_key`;

ALTER TABLE `Boat` RENAME COLUMN `brokerId` TO `sellerId`;

ALTER TABLE `Boat` ADD CONSTRAINT `Boat_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
