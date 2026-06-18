import prisma from "@/src/lib/prisma";
import "dotenv/config";
import { getMaxPokemonNumber } from "./getMaxPokemonNumber";
import { getPokemonData } from "../lib/pokemonApi";

export default async function insertData() {
  console.log("既存のデータを削除します");

  await prisma.$executeRawUnsafe(`
        TRUNCATE TABLE "Stats", "Pokemon"
        RESTART IDENTITY CASCADE;
    `);
  const maxPokemonNumber = await getMaxPokemonNumber();
  console.log("画面の読み込みが始まった");
  for (let i = 1; i <= maxPokemonNumber; i++) {
    const res = await fetch(getPokemonData(i));
    if (!res.ok) {
      break;
    }
    const data = await res.json();
    console.log(`No${i}の${data.name}の登録が完了`);
    await prisma.pokemon.create({
      data: {
        name: data.name,
        imageUrl: data.sprites.other["official-artwork"].front_default,
        type: data.types[0].type.name,
        height: data.height,
        weight: data.weight,
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
insertData();
