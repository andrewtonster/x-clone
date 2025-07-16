/*
  Warnings:

  - You are about to drop the column `imgHeight` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `imgHeight` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `imgHeight`;
