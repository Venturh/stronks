/*
  Warnings:

  - You are about to drop the `ActivitySession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActivitySession" DROP CONSTRAINT "ActivitySession_infoId_fkey";

-- DropForeignKey
ALTER TABLE "ActivitySession" DROP CONSTRAINT "ActivitySession_userId_fkey";

-- DropTable
DROP TABLE "ActivitySession";

-- CreateTable
CREATE TABLE "Workouts" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "calories" DOUBLE PRECISION,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "measuredFormat" TIMESTAMP(3) NOT NULL,
    "appName" TEXT NOT NULL,
    "activityType" INTEGER NOT NULL,
    "activityTypeName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "infoId" TEXT,

    CONSTRAINT "Workouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workouts_objectId_key" ON "Workouts"("objectId");

-- AddForeignKey
ALTER TABLE "Workouts" ADD CONSTRAINT "Workouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workouts" ADD CONSTRAINT "Workouts_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "Info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
