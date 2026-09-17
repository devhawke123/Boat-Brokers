-- AlterTable
ALTER TABLE `ListingComment` ADD COLUMN `fromSeller` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `parentId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `ListingComment_parentId_idx` ON `ListingComment`(`parentId`);

-- AddForeignKey
ALTER TABLE `ListingComment` ADD CONSTRAINT `ListingComment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `ListingComment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
