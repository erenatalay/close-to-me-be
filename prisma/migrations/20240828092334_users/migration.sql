/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpires` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "accessToken",
DROP COLUMN "refreshToken",
DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpires";
