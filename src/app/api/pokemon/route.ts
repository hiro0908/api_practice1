import prisma from "@/src/infrastructure/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await prisma.pokemon.findMany({
    include: {
      stats: true,
      abilities: true,
    },
    orderBy: {
      pokedexId: "asc",
    },
  });

  return NextResponse.json(result);
}
