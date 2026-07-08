/*
  Warnings:

  - The primary key for the `Ability` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Ability` table. All the data in the column will be lost.
  - You are about to drop the column `isHidden` on the `Ability` table. All the data in the column will be lost.
  - You are about to drop the column `pokemonId` on the `Ability` table. All the data in the column will be lost.
  - You are about to drop the column `slot` on the `Ability` table. All the data in the column will be lost.
  - Added the required column `japaneseName` to the `Ability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pokeApiId` to the `Ability` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ability" DROP CONSTRAINT "Ability_pokemonId_fkey";

-- AlterTable
ALTER TABLE "Ability" DROP CONSTRAINT "Ability_pkey",
DROP COLUMN "id",
DROP COLUMN "isHidden",
DROP COLUMN "pokemonId",
DROP COLUMN "slot",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "japaneseName" TEXT NOT NULL,
ADD COLUMN     "pokeApiId" INTEGER NOT NULL,
ADD CONSTRAINT "Ability_pkey" PRIMARY KEY ("pokeApiId");

-- CreateTable
CREATE TABLE "PokemonAbility" (
    "pokemonId" INTEGER NOT NULL,
    "abilityId" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,
    "isHidden" BOOLEAN NOT NULL,

    CONSTRAINT "PokemonAbility_pkey" PRIMARY KEY ("pokemonId","abilityId")
);

-- AddForeignKey
ALTER TABLE "PokemonAbility" ADD CONSTRAINT "PokemonAbility_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonAbility" ADD CONSTRAINT "PokemonAbility_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "Ability"("pokeApiId") ON DELETE RESTRICT ON UPDATE CASCADE;
