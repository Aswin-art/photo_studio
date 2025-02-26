/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Channels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Channels_code_key` ON `Channels`(`code`);
