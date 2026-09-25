-- DropIndex
DROP INDEX `AvailabilitySlot_startsAt_idx` ON `AvailabilitySlot`;

-- CreateIndex
CREATE UNIQUE INDEX `AvailabilitySlot_startsAt_key` ON `AvailabilitySlot`(`startsAt`);
