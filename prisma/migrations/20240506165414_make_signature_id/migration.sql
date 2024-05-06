/*
  Warnings:

  - The primary key for the `PendingTransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PendingTransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PendingTransaction" DROP CONSTRAINT "PendingTransaction_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "PendingTransaction_pkey" PRIMARY KEY ("signature");
