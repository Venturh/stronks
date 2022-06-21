/*
  Warnings:

  - You are about to drop the column `syncBodyFat` on the `GoogleFitSetting` table. All the data in the column will be lost.
  - You are about to drop the column `syncWeight` on the `GoogleFitSetting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GoogleFitSetting" DROP COLUMN "syncBodyFat",
DROP COLUMN "syncWeight",
ADD COLUMN     "syncMeasurements" BOOLEAN NOT NULL DEFAULT false;
