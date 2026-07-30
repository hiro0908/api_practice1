-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "legendary" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mythical" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Evolution" (
    "id" SERIAL NOT NULL,
    "fromPokedexId" INTEGER NOT NULL,
    "toPokedexId" INTEGER NOT NULL,

    CONSTRAINT "Evolution_pkey" PRIMARY KEY ("id")
);
