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
        TRUNCATE TABLE "Stats", "Pokemon"
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

    console.log(
      `No${speciesId}(pokeApiId:${pokeApiId})の${japaneseName}${
        formName ? `(${formName})` : ""
      }の登録が完了`,
    );

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
    };

    await prisma.pokemon.upsert({
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
  }
  console.log("すべてのポケモンの登録が完了した");
}
