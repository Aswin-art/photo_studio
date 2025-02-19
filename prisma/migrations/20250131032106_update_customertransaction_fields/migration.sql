/*
  Warnings:

  - Made the column `studioId` on table `customertransaction` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `bookingTime` on the `customertransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE `customertransaction` DROP FOREIGN KEY `CustomerTransaction_studioId_fkey`;

-- AlterTable
ALTER TABLE `customertransaction` ADD COLUMN `isApproved` BOOLEAN NULL,
    MODIFY `studioId` INTEGER NOT NULL,
    DROP COLUMN `bookingTime`,
    ADD COLUMN `bookingTime` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `customertransaction` ADD CONSTRAINT `CustomerTransaction_studioId_fkey` FOREIGN KEY (`studioId`) REFERENCES `studio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
