export const getPokemonMaxNumberUrl = () => {
  return "https://pokeapi.co/api/v2/pokemon";
};
export const getPokemonData = (id: number) => {
  return `https://pokeapi.co/api/v2/pokemon/${id}`;
};
export const getAllPokemonList = (maximam: number) => {
  return `https://pokeapi.co/api/v2/pokemon?limit=${maximam}`;
};
export const getJapanesePokemonData = (id: number) => {
  return `https://pokeapi.co/api/v2/pokemon-species/${id}`;
};
export async function getPokemon(id: number) {
  const res = await fetch(getPokemonData(id));
  if (!res.ok) {
    throw new Error(`APIからNo${id}:ポケモンのデータを取得できません`);
  }
  return res.json();
}
export async function getMaxPokemonNumber(): Promise<number> {
  const res = await fetch(getPokemonMaxNumberUrl());
  if (!res.ok) {
    throw new Error("APIからポケモンの最大数が取得できません");
  }
  const data = await res.json();
  return data.count;
}
export async function getAllPokemon(max: number) {
  const res = await fetch(getAllPokemonList(max));
  if (!res.ok) {
    throw new Error(
      "APIからのすべてのポケモンデータ取得時にエラーが発生しました",
    );
  }
  return res.json();
}
export async function getJapanesePokemon(id: number) {
  const res = await fetch(getJapanesePokemonData(id));
  if (!res.ok) {
    throw new Error("ポケモンの日本語名の取得時にエラーが発生しました");
  }
  return res.json();
}
