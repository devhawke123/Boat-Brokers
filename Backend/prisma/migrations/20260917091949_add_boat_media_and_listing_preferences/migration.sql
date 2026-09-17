-- AlterTable
ALTER TABLE `Boat` ADD COLUMN `brochureUrl` TEXT NULL,
    ADD COLUMN `videoUrl` TEXT NULL,
    ADD COLUMN `virtualTourUrl` TEXT NULL;

-- AlterTable
ALTER TABLE `BoatListing` ADD COLUMN `additionalNotes` TEXT NULL,
    ADD COLUMN `agreedToContact` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `contactTime` VARCHAR(191) NULL,
    ADD COLUMN `listerType` VARCHAR(191) NULL,
    ADD COLUMN `sellTimeline` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Seller` MODIFY `joiningDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
