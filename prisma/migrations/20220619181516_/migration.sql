/*
  Warnings:

  - You are about to drop the column `syncActivity` on the `GoogleFitSetting` table. All the data in the column will be lost.
  - You are about to drop the column `syncSession` on the `GoogleFitSetting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GoogleFitSetting" DROP COLUMN "syncActivity",
DROP COLUMN "syncSession",
ADD COLUMN     "syncWorkout" BOOLEAN NOT NULL DEFAULT false;
