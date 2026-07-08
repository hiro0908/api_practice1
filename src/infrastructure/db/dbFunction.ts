import prisma from "@/src/infrastructure/db/prisma";
import {
  getMaxPokemonNumber,
  getAllPokemon,
  getPokemonData,
  getJapanesePokemonData,
  extractIdFromUrl,
} from "@/src/infrastructure/api/pokemonApi";

export async function deleteAllPokemonData() {
  console.log("既存のデータを削除します");
  return await prisma.$executeRawUnsafe(`
        TRUNCATE TABLE "PokemonAbility", "Ability", "Stats", "Pokemon"
        RESTART IDENTITY CASCADE;
    `);
}

export async function registerAllPokeomonData() {
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
    const formName = isDefault
      ? null
      : data.name.replace(`${dataja.name}-`, "");
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
      dataja.flavor_text_entries
        .find(
          (entry: { flavor_text: string; language: { name: string } }) =>
            entry.language.name === "ja",
        )
        ?.flavor_text.replace(/\n/g, " ")
        .replace(/\f/g, " ") ?? "";

    const pokemonData = {
      pokedexId: speciesId,
      name: data.name,
      japaneseName,
      imageUrl: data.sprites.other["official-artwork"].front_default,
      difImageUrl: data.sprites.other["official-artwork"].front_shiny,
      type: data.types.map(
        (item: { type: { name: string } }) => item.type.name,
      ),
      height: data.height,
      weight: data.weight,
      isDefault,
      formName,
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
        formName ? `(${formName})` : ""
      }の登録が完了`,
    );
  }

  console.log("すべてのポケモンの登録が完了した");
}
