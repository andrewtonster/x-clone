-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_rePostId_fkey`;

-- DropIndex
DROP INDEX `Post_rePostId_fkey` ON `Post`;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_rePostId_fkey` FOREIGN KEY (`rePostId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
