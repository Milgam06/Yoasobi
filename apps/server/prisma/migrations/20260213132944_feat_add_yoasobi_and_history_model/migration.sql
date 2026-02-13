/*
  Warnings:

  - A unique constraint covering the columns `[userId,weekStartDate]` on the table `Yoasobi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alarmTime` to the `Yoasobi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Yoasobi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekStartDate` to the `Yoasobi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Yoasobi" DROP CONSTRAINT "Yoasobi_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Seoul',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Yoasobi" ADD COLUMN     "alarmTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "weekStartDate" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "yoasobiId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "image" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "History_yoasobiId_key" ON "History"("yoasobiId");

-- CreateIndex
CREATE INDEX "History_userId_createdAt_idx" ON "History"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Yoasobi_userId_createdAt_idx" ON "Yoasobi"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Yoasobi_userId_weekStartDate_key" ON "Yoasobi"("userId", "weekStartDate");

-- AddForeignKey
ALTER TABLE "Yoasobi" ADD CONSTRAINT "Yoasobi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_yoasobiId_fkey" FOREIGN KEY ("yoasobiId") REFERENCES "Yoasobi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
