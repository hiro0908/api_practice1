import { getPokemonMaxNumberUrl } from "@/src/lib/pokemonApi";

export async function getMaxPokemonNumber(): Promise<number> {
  const res = await fetch(getPokemonMaxNumberUrl());
  const data = await res.json();

  return data.count;
}
