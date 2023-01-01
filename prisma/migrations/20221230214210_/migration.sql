-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('SUPER', 'GOOD', 'OK', 'BAD', 'TERRIBLE');

-- AlterTable
ALTER TABLE "Info" ADD COLUMN     "mood" "Mood";
