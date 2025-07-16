-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_postId_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_parentPostId_fkey`;

-- DropForeignKey
ALTER TABLE `SavedPosts` DROP FOREIGN KEY `SavedPosts_postId_fkey`;

-- DropIndex
DROP INDEX `Like_postId_fkey` ON `Like`;

-- DropIndex
DROP INDEX `Post_parentPostId_fkey` ON `Post`;

-- DropIndex
DROP INDEX `SavedPosts_postId_fkey` ON `SavedPosts`;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_parentPostId_fkey` FOREIGN KEY (`parentPostId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedPosts` ADD CONSTRAINT `SavedPosts_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
