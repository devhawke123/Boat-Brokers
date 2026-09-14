-- AlterTable
ALTER TABLE `Boat` ADD COLUMN `boatType` VARCHAR(191) NULL,
    ADD COLUMN `gasExtraNotes` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `BoatImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `boatId` INTEGER NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BoatImage_boatId_idx`(`boatId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BoatImage` ADD CONSTRAINT `BoatImage_boatId_fkey` FOREIGN KEY (`boatId`) REFERENCES `Boat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
