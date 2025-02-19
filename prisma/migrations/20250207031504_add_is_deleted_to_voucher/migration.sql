/*
  Warnings:

  - A unique constraint covering the columns `[name,is_deleted]` on the table `voucher` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `voucher_name_key` ON `voucher`;

-- AlterTable
ALTER TABLE `voucher` ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `voucher_name_is_deleted_key` ON `voucher`(`name`, `is_deleted`);
