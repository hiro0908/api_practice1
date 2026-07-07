/*
  Warnings:

  - You are about to drop the column `discription` on the `Pokemon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "discription",
ADD COLUMN     "description" TEXT;
