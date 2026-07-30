/*
  Warnings:

  - You are about to drop the column `formName` on the `Pokemon` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pokedexId,formDisplayName]` on the table `Pokemon` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Pokemon_pokedexId_formName_key";

-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "formName",
ADD COLUMN     "formDisplayName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_pokedexId_formDisplayName_key" ON "Pokemon"("pokedexId", "formDisplayName");
