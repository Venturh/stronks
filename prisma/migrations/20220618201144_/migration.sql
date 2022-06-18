-- CreateTable
CREATE TABLE "ActivitySteps" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "steps" DOUBLE PRECISION NOT NULL,
    "distance" DOUBLE PRECISION,
    "duration" DOUBLE PRECISION,
    "calories" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "measuredFormat" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "infoId" TEXT,

    CONSTRAINT "ActivitySteps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivitySteps_objectId_key" ON "ActivitySteps"("objectId");

-- AddForeignKey
ALTER TABLE "ActivitySteps" ADD CONSTRAINT "ActivitySteps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitySteps" ADD CONSTRAINT "ActivitySteps_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "Info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
