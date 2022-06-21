/*
  Warnings:

  - Added the required column `measuredAt` to the `Measurements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Measurements" ADD COLUMN     "measuredAt" TIMESTAMP(3) NOT NULL;
