/*
  Warnings:

  - The primary key for the `addon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `channelimages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `channels` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `customeraddon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `customertransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `holiday` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `results` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `studio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `templates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `voucher` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `channelimages` DROP FOREIGN KEY `ChannelImages_channel_id_fkey`;

-- DropForeignKey
ALTER TABLE `customeraddon` DROP FOREIGN KEY `CustomerAddon_addonId_fkey`;

-- DropForeignKey
ALTER TABLE `customeraddon` DROP FOREIGN KEY `CustomerAddon_transactionId_fkey`;

-- DropForeignKey
ALTER TABLE `customertransaction` DROP FOREIGN KEY `CustomerTransaction_studioId_fkey`;

-- DropForeignKey
ALTER TABLE `customertransaction` DROP FOREIGN KEY `CustomerTransaction_voucherId_fkey`;

-- DropForeignKey
ALTER TABLE `results` DROP FOREIGN KEY `Results_channel_id_fkey`;

-- DropForeignKey
ALTER TABLE `results` DROP FOREIGN KEY `Results_template_id_fkey`;

-- DropIndex
DROP INDEX `ChannelImages_channel_id_fkey` ON `channelimages`;

-- DropIndex
DROP INDEX `Results_channel_id_fkey` ON `results`;

-- DropIndex
DROP INDEX `Results_template_id_fkey` ON `results`;

-- AlterTable
ALTER TABLE `addon` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `channelimages` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `channel_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `channels` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `customeraddon` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `transactionId` VARCHAR(191) NOT NULL,
    MODIFY `addonId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `customertransaction` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `studioId` VARCHAR(191) NOT NULL,
    MODIFY `voucherId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `holiday` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `results` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `template_id` VARCHAR(191) NULL,
    MODIFY `channel_id` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `studio` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `templates` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `voucher` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `customeraddon` ADD CONSTRAINT `CustomerAddon_addonId_fkey` FOREIGN KEY (`addonId`) REFERENCES `addon`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customeraddon` ADD CONSTRAINT `CustomerAddon_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `customertransaction`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customertransaction` ADD CONSTRAINT `CustomerTransaction_studioId_fkey` FOREIGN KEY (`studioId`) REFERENCES `studio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customertransaction` ADD CONSTRAINT `CustomerTransaction_voucherId_fkey` FOREIGN KEY (`voucherId`) REFERENCES `voucher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChannelImages` ADD CONSTRAINT `ChannelImages_channel_id_fkey` FOREIGN KEY (`channel_id`) REFERENCES `Channels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Results` ADD CONSTRAINT `Results_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `Templates`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Results` ADD CONSTRAINT `Results_channel_id_fkey` FOREIGN KEY (`channel_id`) REFERENCES `Channels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
