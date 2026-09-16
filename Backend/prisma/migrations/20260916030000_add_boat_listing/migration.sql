-- Create BoatListing (boat <-> seller) and ListingComment tables

CREATE TABLE `BoatListing` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `boatId` INT NOT NULL,
    `sellerId` INT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    INDEX `BoatListing_boatId_idx`(`boatId`),
    INDEX `BoatListing_sellerId_idx`(`sellerId`)
) DEFAULT CHARACTER SET utf8mb4;

CREATE TABLE `ListingComment` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `listingId` INT NOT NULL,
    `content` TEXT NOT NULL,
    `author` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    INDEX `ListingComment_listingId_idx`(`listingId`)
) DEFAULT CHARACTER SET utf8mb4;

ALTER TABLE `BoatListing` ADD CONSTRAINT `BoatListing_boatId_fkey` FOREIGN KEY (`boatId`) REFERENCES `Boat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `BoatListing` ADD CONSTRAINT `BoatListing_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ListingComment` ADD CONSTRAINT `ListingComment_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `BoatListing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
