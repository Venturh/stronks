/*
  Warnings:

  - You are about to drop the `Supplements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Supplements" DROP CONSTRAINT "Supplements_infoId_fkey";

-- DropForeignKey
ALTER TABLE "Supplements" DROP CONSTRAINT "Supplements_userId_fkey";

-- DropTable
DROP TABLE "Supplements";
