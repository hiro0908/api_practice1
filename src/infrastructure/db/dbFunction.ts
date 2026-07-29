import fs from "node:fs/promises";
import path from "node:path";
import prisma from "@/src/infrastructure/db/prisma";
import {
  getMaxPokemonNumber,
  getAllPokemon,
  getPokemonData,
  getJapanesePokemonData,
  extractIdFromUrl,
  getPokemonFormData,
  fetchWithRetry,
} from "@/src/infrastructure/api/pokemonApi";

const IMAGE_DIR = path.join(process.cwd(), "public", "images");
const DIF_IMAGE_DIR = path.join(process.cwd(), "public", "difImages");

// 起動のたびにGitHub(raw.githubusercontent.com)へ画像を取りに行ってメモリを消費するのを防ぐため、
// 一度public配下に保存したらDBにはそのパスだけを持たせ、以降はダウンロードをスキップする
async function saveImageIfMissing(
  url: string | null,
  dir: string,
  publicSubDir: string,
  pokeApiId: number,
): Promise<string | null> {
  if (!url) return null;

  const fileName = `${pokeApiId}.png`;
  const filePath = path.join(dir, fileName);
  const publicPath = `/${publicSubDir}/${fileName}`;

  try {
    await fs.access(filePath);
    return publicPath;
  } catch {
    // ファイルが存在しない場合のみダウンロードする
  }

  const res = await fetchWithRetry(url);
  if (!res.ok) return null;

  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  return publicPath;
}

export async function deleteAllPokemonData() {
  console.log("既存のデータを削除します");
  return await prisma.$executeRawUnsafe(`
        TRUNCATE TABLE "PokemonAbility", "Ability", "Stats", "Pokemon", "Evolution"
        RESTART IDENTITY CASCADE;
    `);
}

// PokeAPI側のレート制限に引っかからない範囲で並列実行数を抑える
const FETCH_CONCURRENCY = 30;

async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<void>,
) {
  let cursor = 0;
  const runWorker = async () => {
    while (cursor < items.length) {
      const item = items[cursor++];
      await worker(item);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, runWorker),
  );
}

export async function registerAllPokeomonData() {
  await fs.mkdir(IMAGE_DIR, { recursive: true });
  await fs.mkdir(DIF_IMAGE_DIR, { recursive: true });

  const maxPokemonNumber = await getMaxPokemonNumber();
  console.log("画面の読み込みが始まった");
  const list = await getAllPokemon(maxPokemonNumber);
  // 進化チェーンは複数のポケモン(例:フシギダネ系列の3匹)が同じチェーンを共有しているため、
  // チェーンIDごとに一度だけ登録するよう並列ワーカー間で共有する
  const processedEvolutionChainIds = new Set<number>();

  await runWithConcurrency(
    list.results as { name: string; url: string }[],
    FETCH_CONCURRENCY,
    async (item) => {
      const pokeApiId = extractIdFromUrl(item.url);

      try {
        await registerOnePokemon(pokeApiId, processedEvolutionChainIds);
      } catch (err) {
        console.log(`No${pokeApiId}の登録に失敗したためスキップします`, err);
      }
    },
  );

  console.log("すべてのポケモンの登録が完了した");
}

type EvolutionChainNode = {
  species: { url: string };
  evolves_to: EvolutionChainNode[];
};

async function registerEvolutionChain(url: string) {
  const res = await fetchWithRetry(url);
  if (!res.ok) return;
  const chainData = await res.json();

  const edges: { fromPokedexId: number; toPokedexId: number }[] = [];
  const collectEdges = (node: EvolutionChainNode) => {
    const fromPokedexId = extractIdFromUrl(node.species.url);
    for (const next of node.evolves_to) {
      edges.push({
        fromPokedexId,
        toPokedexId: extractIdFromUrl(next.species.url),
      });
      collectEdges(next);
    }
  };
  collectEdges(chainData.chain);

  if (edges.length > 0) {
    await prisma.evolution.createMany({ data: edges });
  }
}

// Pokemon本体は既に登録済みだが進化データだけが未登録、というケースを埋めるための
// 軽量な追加バッチ(画像取得や特性取得を伴わないため registerAllPokeomonData より大幅に速い)
export async function registerAllEvolutionData() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "Evolution" RESTART IDENTITY;
  `);

  const pokemonList = await prisma.pokemon.findMany({
    distinct: ["pokedexId"],
    select: { pokedexId: true },
  });
  const processedEvolutionChainIds = new Set<number>();

  await runWithConcurrency(
    pokemonList.map((p) => p.pokedexId),
    FETCH_CONCURRENCY,
    async (pokedexId) => {
      try {
        const res = await fetchWithRetry(getJapanesePokemonData(pokedexId));
        if (!res.ok) return;
        const dataja = await res.json();
        const chainUrl = dataja.evolution_chain?.url as string | undefined;
        if (!chainUrl) return;

        const chainId = extractIdFromUrl(chainUrl);
        if (processedEvolutionChainIds.has(chainId)) return;
        processedEvolutionChainIds.add(chainId);
        await registerEvolutionChain(chainUrl);
      } catch (err) {
        console.log(`No${pokedexId}の進化チェーン取得に失敗しました`, err);
      }
    },
  );

  console.log("進化データの登録が完了した");
}

async function registerOnePokemon(
  pokeApiId: number,
  processedEvolutionChainIds: Set<number>,
) {
  const res = await fetchWithRetry(getPokemonData(pokeApiId));
  if (!res.ok) {
    console.log(`No${pokeApiId}のデータが存在しません。スキップします`);
    return;
  }
  const data = await res.json();

  const speciesId = extractIdFromUrl(data.species.url);
  const resja = await fetchWithRetry(getJapanesePokemonData(speciesId));
  const dataja = await resja.json();
  // console.log(dataja);
  const legendary = dataja.is_legendary as boolean;
  const mythical = dataja.is_mythical as boolean;
  const japaneseName =
    dataja.names.find(
      (n: { language: { name: string }; name: string }) =>
        n.language.name == "ja-hrkt",
    )?.name ?? data.name;

  if (dataja.evolution_chain?.url) {
    const chainId = extractIdFromUrl(dataja.evolution_chain.url);
    if (!processedEvolutionChainIds.has(chainId)) {
      processedEvolutionChainIds.add(chainId);
      await registerEvolutionChain(dataja.evolution_chain.url);
    }
  }

  const isDefault = data.is_default as boolean;
  const formApiId = extractIdFromUrl((data.forms as { url: string }[])[0].url);
  const formData = await getPokemonFormData(formApiId);
  const formDisplayName =
    formData.form_names.find(
      (e: { name: string; language: { name: string } }) =>
        e.language.name === "ja",
    )?.name ??
    formData.form_names.find(
      (e: { name: string; language: { name: string } }) =>
        e.language.name === "en",
    )?.name ??
    null;
  // ① Ability登録: PokemonAbilityが参照するAbilityの一覧を作成する
  const abilityData = await Promise.all(
    data.abilities.map(
      async (a: {
        ability: { name: string; url: string };
        slot: number;
        is_hidden: boolean;
      }) => {
        const abilityApiId = extractIdFromUrl(a.ability.url);
        const abilityRes = await fetchWithRetry(a.ability.url);
        const abilityJson = await abilityRes.json();
        const japaneseAbilityName =
          abilityJson.names.find(
            (n: { language: { name: string }; name: string }) =>
              n.language.name === "ja",
          )?.name ?? a.ability.name;
        const abilityDescription =
          abilityJson.flavor_text_entries
            .find(
              (entry: { flavor_text: string; language: { name: string } }) =>
                entry.language.name === "ja",
            )
            ?.flavor_text.replace(/\n/g, " ")
            .replace(/\f/g, " ") ?? null;

        await prisma.ability.upsert({
          where: { pokeApiId: abilityApiId },
          update: {
            name: a.ability.name,
            japaneseName: japaneseAbilityName,
            description: abilityDescription,
          },
          create: {
            pokeApiId: abilityApiId,
            name: a.ability.name,
            japaneseName: japaneseAbilityName,
            description: abilityDescription,
          },
        });

        return {
          abilityApiId,
          slot: a.slot,
          isHidden: a.is_hidden,
        };
      },
    ),
  );
  const description =
    (
      dataja.flavor_text_entries.find(
        (entry: { language: { name: string } }) => entry.language.name === "ja",
      ) ??
      dataja.flavor_text_entries.find(
        (entry: { language: { name: string } }) => entry.language.name === "en",
      )
    )?.flavor_text
      .replace(/\n/g, " ")
      .replace(/\f/g, " ") ?? "";

  const imageUrl = await saveImageIfMissing(
    data.sprites.other["official-artwork"].front_default,
    IMAGE_DIR,
    "images",
    pokeApiId,
  );
  const difImageUrl = await saveImageIfMissing(
    data.sprites.other["official-artwork"].front_shiny,
    DIF_IMAGE_DIR,
    "difImages",
    pokeApiId,
  );

  const pokemonData = {
    pokedexId: speciesId,
    name: data.name,
    japaneseName,
    imageUrl,
    difImageUrl,
    type: data.types.map((item: { type: { name: string } }) => item.type.name),
    height: data.height,
    weight: data.weight,
    isDefault,
    formDisplayName,
    legendary,
    mythical,
    description,
  };

  // ② Pokemon登録
  const pokemon = await prisma.pokemon.upsert({
    where: { pokeApiId },
    update: pokemonData,
    create: {
      ...pokemonData,
      pokeApiId,
      stats: {
        create: data.stats.map(
          (s: { stat: { name: string }; base_stat: number }) => ({
            name: s.stat.name,
            value: s.base_stat,
          }),
        ),
      },
    },
  });

  // ③ 中間テーブル登録: 特性構成が変わっている場合に備えて作り直す
  await prisma.pokemonAbility.deleteMany({
    where: { pokemonId: pokemon.id },
  });
  await prisma.pokemonAbility.createMany({
    data: abilityData.map((a) => ({
      pokemonId: pokemon.id,
      abilityId: a.abilityApiId,
      slot: a.slot,
      isHidden: a.isHidden,
    })),
  });
  console.log(
    `No${speciesId}(pokeApiId:${pokeApiId})の${japaneseName}${
      formDisplayName ? "(" + formDisplayName + ")" : ""
    }の登録が完了`,
  );
}
