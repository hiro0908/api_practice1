// 並列実行時にPokeAPI側やネットワークの一時的な接続エラー(ETIMEDOUT等)が
// 発生しても処理全体を落とさないよう、接続失敗時のみリトライする
export async function fetchWithRetry(
  url: string,
  retries = 3,
  delayMs = 500,
): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetch(url);
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
  throw new Error("unreachable");
}

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
export const getJapanesePokemonFormData = (id: number) => {
  return `https://pokeapi.co/api/v2/pokemon-form/${id}`;
};
export const extractIdFromUrl = (url: string): number => {
  const match = url.match(/\/(\d+)\/?$/);
  if (!match) {
    throw new Error(`URLからIDを取得できません: ${url}`);
  }
  return Number(match[1]);
};
export async function getPokemon(id: number) {
  const res = await fetchWithRetry(getPokemonData(id));
  if (!res.ok) {
    throw new Error(`APIからNo${id}:ポケモンのデータを取得できません`);
  }
  return res.json();
}
export async function getMaxPokemonNumber(): Promise<number> {
  const res = await fetchWithRetry(getPokemonMaxNumberUrl());
  if (!res.ok) {
    throw new Error("APIからポケモンの最大数が取得できません");
  }
  const data = await res.json();
  return data.count;
}
export async function getAllPokemon(max: number) {
  const res = await fetchWithRetry(getAllPokemonList(max));
  if (!res.ok) {
    throw new Error(
      "APIからのすべてのポケモンデータ取得時にエラーが発生しました",
    );
  }
  return res.json();
}
export async function getJapanesePokemon(id: number) {
  const res = await fetchWithRetry(getJapanesePokemonData(id));
  if (!res.ok) {
    throw new Error("ポケモンの日本語名の取得時にエラーが発生しました");
  }
  return res.json();
}

export async function getPokemonFormData(id: number) {
  const res = await fetchWithRetry(getJapanesePokemonFormData(id));
  if (!res.ok) {
    throw new Error("ポケモンフォーム情報の取得に失敗しました");
  }
  return res.json();
}
