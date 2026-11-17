-- AlterTable
ALTER TABLE `AvailabilitySlot`
  ADD COLUMN `repeatsUntil` DATETIME(3) NULL,
  ADD COLUMN `boatIds` JSON NULL;
