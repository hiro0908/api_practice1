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

  const res = await fetch(url);
  if (!res.ok) return null;

  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  return publicPath;
}

export async function deleteAllPokemonData() {
  console.log("既存のデータを削除します");
  return await prisma.$executeRawUnsafe(`
        TRUNCATE TABLE "PokemonAbility", "Ability", "Stats", "Pokemon"
        RESTART IDENTITY CASCADE;
    `);
}

export async function registerAllPokeomonData() {
  await fs.mkdir(IMAGE_DIR, { recursive: true });
  await fs.mkdir(DIF_IMAGE_DIR, { recursive: true });

  const maxPokemonNumber = await getMaxPokemonNumber();
  console.log("画面の読み込みが始まった");
  const list = await getAllPokemon(maxPokemonNumber);

  for (const item of list.results as { name: string; url: string }[]) {
    const pokeApiId = extractIdFromUrl(item.url);

    const res = await fetch(getPokemonData(pokeApiId));
    if (!res.ok) {
      console.log(`No${pokeApiId}のデータが存在しません。スキップします`);
      continue;
    }
    const data = await res.json();

    const speciesId = extractIdFromUrl(data.species.url);
    const resja = await fetch(getJapanesePokemonData(speciesId));
    const dataja = await resja.json();
    const japaneseName =
      dataja.names.find(
        (n: { language: { name: string }; name: string }) =>
          n.language.name == "ja-hrkt",
      )?.name ?? data.name;

    const isDefault = data.is_default as boolean;
    const formApiId = extractIdFromUrl(
      (data.forms as { url: string }[])[0].url,
    );
    const formData = await getPokemonFormData(formApiId);
    const formDisplayName =
      formData.form_names.find((e:{name:string;language:{name:string}}) => e.language.name === "ja")?.name ??
      formData.form_names.find((e:{name:string;language:{name:string}}) => e.language.name === "en")?.name ??
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
          const abilityRes = await fetch(a.ability.url);
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
          (entry: { language: { name: string } }) =>
            entry.language.name === "ja",
        ) ??
        dataja.flavor_text_entries.find(
          (entry: { language: { name: string } }) =>
            entry.language.name === "en",
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
      type: data.types.map(
        (item: { type: { name: string } }) => item.type.name,
      ),
      height: data.height,
      weight: data.weight,
      isDefault,
      formDisplayName,
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
        formDisplayName ? "("+formDisplayName+")" : ""
      }の登録が完了`,
    );
  }

  console.log("すべてのポケモンの登録が完了した");
}
