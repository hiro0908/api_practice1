/*
  Warnings:

  - A unique constraint covering the columns `[pokeApiId]` on the table `Pokemon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pokedexId,formName]` on the table `Pokemon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pokeApiId` to the `Pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pokedexId` to the `Pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "formName" TEXT,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pokeApiId" INTEGER NOT NULL,
ADD COLUMN     "pokedexId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_pokeApiId_key" ON "Pokemon"("pokeApiId");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_pokedexId_formName_key" ON "Pokemon"("pokedexId", "formName");
