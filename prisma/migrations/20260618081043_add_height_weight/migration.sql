/*
  Warnings:

  - Added the required column `height` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "weight" INTEGER NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL;
