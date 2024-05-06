/*
  Warnings:

  - You are about to drop the column `timeStamp` on the `PendingTransaction` table. All the data in the column will be lost.
  - Added the required column `timestamp` to the `PendingTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PendingTransaction" DROP COLUMN "timeStamp",
ADD COLUMN     "timestamp" TIMESTAMPTZ(3) NOT NULL;
