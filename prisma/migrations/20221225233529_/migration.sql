-- CreateEnum
CREATE TYPE "HabitCategory" AS ENUM ('PHYSICAL_FITNESS', 'MENTAL_HEALTH', 'PERSONAL_DEVELOPMENT', 'CAREER', 'MONEY', 'COMMUNICATION', 'ROMANCE', 'HOBBIES', 'SUSTAINABILITY', 'CREATIVITY', 'TIME_MANAGEMENT', 'STRESS_MANAGEMENT', 'SELF_CARE', 'HOME_ORGANIZATION');

-- CreateTable
CREATE TABLE "Habits" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emote" TEXT,
    "category" "HabitCategory" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletedHabits" (
    "id" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "habitId" TEXT NOT NULL,
    "infoId" TEXT,

    CONSTRAINT "CompletedHabits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Habits" ADD CONSTRAINT "Habits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedHabits" ADD CONSTRAINT "CompletedHabits_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "Info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletedHabits" ADD CONSTRAINT "CompletedHabits_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
