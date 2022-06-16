-- CreateEnum
CREATE TYPE "Phase" AS ENUM ('MAINTAIN', 'CUTTING', 'BULKING');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "refresh_token_expires_in" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "hiddenOverviewColumns" TEXT[],
    "phase" "Phase" NOT NULL DEFAULT E'MAINTAIN',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleFitSetting" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "syncWeight" BOOLEAN NOT NULL DEFAULT false,
    "syncBodyFat" BOOLEAN NOT NULL DEFAULT false,
    "syncSteps" BOOLEAN NOT NULL DEFAULT false,
    "syncActivity" BOOLEAN NOT NULL DEFAULT false,
    "syncSession" BOOLEAN NOT NULL DEFAULT false,
    "syncNutrition" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoogleFitSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measurements" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "measuredFormat" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION,
    "bodyFat" DOUBLE PRECISION,
    "infoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalMeasures" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "neck" INTEGER,
    "shoulders" INTEGER,
    "chest" INTEGER,
    "leftBicep" INTEGER,
    "rightBicep" INTEGER,
    "leftForearm" INTEGER,
    "rightForearm" INTEGER,
    "upperAbs" INTEGER,
    "lowerAbs" INTEGER,
    "waist" INTEGER,
    "hips" INTEGER,
    "letfThigh" INTEGER,
    "rightThigh" INTEGER,
    "leftCalf" INTEGER,
    "rightCalf" INTEGER,
    "measuresId" TEXT NOT NULL,

    CONSTRAINT "AdditionalMeasures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nutrition" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT,
    "calories" DOUBLE PRECISION,
    "carbohydrates" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "originDataSourceId" TEXT,
    "category" TEXT,
    "measuredFormat" TIMESTAMP(3) NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "infoId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Nutrition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplements" (
    "id" TEXT NOT NULL,
    "measuredFormat" TIMESTAMP(3) NOT NULL,
    "creatine" BOOLEAN DEFAULT false,
    "multiVitamin" BOOLEAN DEFAULT false,
    "infoId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Supplements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivitySession" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "steps" DOUBLE PRECISION,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "measuredFormat" TIMESTAMP(3) NOT NULL,
    "appName" TEXT NOT NULL,
    "activityType" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "infoId" TEXT,

    CONSTRAINT "ActivitySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Info" (
    "id" TEXT NOT NULL,
    "measuredFormat" TIMESTAMP(3) NOT NULL,
    "phase" "Phase" DEFAULT E'MAINTAIN',
    "notes" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Measurements_objectId_key" ON "Measurements"("objectId");

-- CreateIndex
CREATE UNIQUE INDEX "Measurements_measuredFormat_key" ON "Measurements"("measuredFormat");

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalMeasures_objectId_key" ON "AdditionalMeasures"("objectId");

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalMeasures_measuresId_key" ON "AdditionalMeasures"("measuresId");

-- CreateIndex
CREATE UNIQUE INDEX "Nutrition_objectId_key" ON "Nutrition"("objectId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplements_measuredFormat_key" ON "Supplements"("measuredFormat");

-- CreateIndex
CREATE UNIQUE INDEX "Supplements_infoId_key" ON "Supplements"("infoId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivitySession_objectId_key" ON "ActivitySession"("objectId");

-- CreateIndex
CREATE UNIQUE INDEX "Info_measuredFormat_key" ON "Info"("measuredFormat");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleFitSetting" ADD CONSTRAINT "GoogleFitSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurements" ADD CONSTRAINT "Measurements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurements" ADD CONSTRAINT "Measurements_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "Info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalMeasures" ADD CONSTRAINT "AdditionalMeasures_measuresId_fkey" FOREIGN KEY ("measuresId") REFERENCES "Measurements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrition" ADD CONSTRAINT "Nutrition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutrition" ADD CONSTRAINT "Nutrition_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "Info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplements" ADD CONSTRAINT "Supplements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplements" ADD CONSTRAINT "Supplements_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "Info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitySession" ADD CONSTRAINT "ActivitySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitySession" ADD CONSTRAINT "ActivitySession_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "Info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Info" ADD CONSTRAINT "Info_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
