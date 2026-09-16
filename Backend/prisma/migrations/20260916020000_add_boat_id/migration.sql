-- Add boatId (unique, generated) to Boat

ALTER TABLE `Boat` ADD COLUMN `boatId` VARCHAR(191) NULL;

-- Backfill existing rows with a generated id
UPDATE `Boat` SET `boatId` = CONCAT('BOAT-', LPAD(`id`, 6, '0')) WHERE `boatId` IS NULL;

ALTER TABLE `Boat` MODIFY COLUMN `boatId` VARCHAR(191) NOT NULL;

ALTER TABLE `Boat` ADD UNIQUE INDEX `Boat_boatId_key` (`boatId`);
