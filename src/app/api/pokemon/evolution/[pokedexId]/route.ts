import prisma from "@/src/infrastructure/db/prisma";
import { NextRequest, NextResponse } from "next/server";


type EvolutionNode = {
  pokedexId: number;
  pokeApiId: number;
  name: string;
  japaneseName: string;
  imageUrl: string | null;
  evolvesTo: EvolutionNode[];
};

async function findRootPokedexId(pokedexId: number): Promise<number> {
  let current = pokedexId;
  for (;;) {
    const parentEdge = await prisma.evolution.findFirst({
      where: { toPokedexId: current },
    });
    if (!parentEdge) return current;
    current = parentEdge.fromPokedexId;
  }
}

async function buildNode(pokedexId: number): Promise<EvolutionNode | null> {
  const pokemon = await prisma.pokemon.findFirst({
    where: { pokedexId, isDefault: true },
  });
  if (!pokemon) return null;

  const children = await prisma.evolution.findMany({
    where: { fromPokedexId: pokedexId },
  });
  const evolvesTo = (
    await Promise.all(children.map((c) => buildNode(c.toPokedexId)))
  ).filter((node): node is EvolutionNode => node !== null);

  return {
    pokedexId: pokemon.pokedexId,
    pokeApiId: pokemon.pokeApiId,
    name: pokemon.name,
    japaneseName: pokemon.japaneseName ?? pokemon.name,
    imageUrl: pokemon.imageUrl,
    evolvesTo,
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pokedexId: string }> },
) {
  const { pokedexId } = await params;
  const rootPokedexId = await findRootPokedexId(Number(pokedexId));
  const tree = await buildNode(rootPokedexId);

  if (!tree) {
    return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
  }

  return NextResponse.json({ tree });
}
