-- Create BoatCustomField (seller-defined per-boat label/value spec rows)

CREATE TABLE `BoatCustomField` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `boatId` INT NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `position` INT NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    INDEX `BoatCustomField_boatId_idx`(`boatId`)
) DEFAULT CHARACTER SET utf8mb4;

ALTER TABLE `BoatCustomField` ADD CONSTRAINT `BoatCustomField_boatId_fkey` FOREIGN KEY (`boatId`) REFERENCES `Boat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
