import prisma from "@/src/infrastructure/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await prisma.pokemon.findUnique({
    where: {
      pokeApiId: Number(id),
    },
    include: {
      stats: true,
      abilities: {
        include: {
          ability: true,
        },
        orderBy: {
          slot: "asc",
        },
      },
    },
  });

  if (!result) {
    return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
  }
  // const forms = await prisma.pokemon.findMany({
  //   where: { pokedexId: result.pokedexId },
  //   orderBy: {
  //     pokeApiId: "asc",
  //   },
  // });
  const pokemon = {
    ...result,
    abilities:
      result?.abilities.map((a) => ({
        id: a.ability.pokeApiId,
        name: a.ability.japaneseName,
        description: a.ability.description,
        slot: a.slot,
        isHidden: a.isHidden,
      })) ?? [],
  };

  return NextResponse.json({ pokemon });
}
