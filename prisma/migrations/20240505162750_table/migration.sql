/*
  Warnings:

  - Added the required column `signature` to the `PendingTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PendingTransaction" ADD COLUMN     "signature" TEXT NOT NULL;
