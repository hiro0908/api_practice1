import prisma from "@/src/infrastructure/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pokedexId: string }> },
) {
  const { pokedexId } = await params;
  const forms = await prisma.pokemon.findMany({
    where: {
      pokedexId: Number(pokedexId),
    },

    orderBy: {
      pokeApiId: "asc",
    },
    select: {
      imageUrl: true,
      pokeApiId: true,
      formDisplayName: true,
        japaneseName:true,
    },
  });

  if (!forms) {
    return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
  }

  return NextResponse.json({ forms });
}
