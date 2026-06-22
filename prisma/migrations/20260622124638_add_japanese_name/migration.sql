/*
  Warnings:

  - The `imageUrl` column on the `Pokemon` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `Pokemon` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "japaneseName" TEXT,
DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[],
DROP COLUMN "type",
ADD COLUMN     "type" TEXT[];
