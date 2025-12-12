/*
  Warnings:

  - You are about to drop the column `categoryNeeded` on the `TeamOpening` table. All the data in the column will be lost.
  - You are about to drop the column `dayOfWeek` on the `TeamOpening` table. All the data in the column will be lost.
  - You are about to drop the column `isFemaleOnly` on the `TeamOpening` table. All the data in the column will be lost.
  - You are about to drop the column `isOpen` on the `TeamOpening` table. All the data in the column will be lost.
  - You are about to drop the column `minRacingScore` on the `TeamOpening` table. All the data in the column will be lost.
  - You are about to drop the column `raceTime` on the `TeamOpening` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `TeamOpening` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `TeamOpening` table. All the data in the column will be lost.
  - You are about to drop the column `timeZone` on the `TeamOpening` table. All the data in the column will be lost.
  - Added the required column `title` to the `TeamOpening` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TeamOpening" DROP CONSTRAINT "TeamOpening_teamId_fkey";

-- DropIndex
DROP INDEX "ContactRequest_fromUserId_idx";

-- DropIndex
DROP INDEX "ContactRequest_teamId_idx";

-- DropIndex
DROP INDEX "ContactRequest_toUserId_idx";

-- AlterTable
ALTER TABLE "TeamOpening" DROP COLUMN "categoryNeeded",
DROP COLUMN "dayOfWeek",
DROP COLUMN "isFemaleOnly",
DROP COLUMN "isOpen",
DROP COLUMN "minRacingScore",
DROP COLUMN "raceTime",
DROP COLUMN "requirements",
DROP COLUMN "role",
DROP COLUMN "timeZone",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "days" TEXT[],
ADD COLUMN     "description" TEXT,
ADD COLUMN     "timezone" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastActiveAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "contactRequestId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seenAt" TIMESTAMP(3),

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypingState" (
    "id" TEXT NOT NULL,
    "contactRequestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TypingState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TypingState_contactRequestId_userId_key" ON "TypingState"("contactRequestId", "userId");

-- AddForeignKey
ALTER TABLE "TeamOpening" ADD CONSTRAINT "TeamOpening_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_contactRequestId_fkey" FOREIGN KEY ("contactRequestId") REFERENCES "ContactRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
