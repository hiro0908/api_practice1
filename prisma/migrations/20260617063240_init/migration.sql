-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "type" TEXT,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);
