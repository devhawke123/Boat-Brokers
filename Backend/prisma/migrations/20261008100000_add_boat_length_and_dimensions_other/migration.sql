-- AlterTable
-- TEXT rather than VARCHAR(191): the Boat table is already at MySQL's row-size limit.
ALTER TABLE `Boat` ADD COLUMN `boatLength` TEXT NULL,
    ADD COLUMN `dimensionsOther` TEXT NULL;
