import prisma from "@/src/lib/prisma";
import dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});
import { getMaxPokemonNumber } from "./getMaxPokemonNumber";
import { getPokemonData } from "../lib/pokemonApi";
import { getJapanesePokemonData } from "../lib/pokemonApi";
console.log("DATABASE_URL =", process.env.DATABASE_URL);

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
      console.log("ポケモンのデータが存在しません。登録を終了します");
      break;
    }
    const data = await res.json();
    const resja = await fetch(getJapanesePokemonData(i));
    const dataja = await resja.json();
    const japaneseName =
      dataja.names.find(
        (n: { language: { name: string }; name: string }) =>
          n.language.name == "ja-hrkt",
      )?.name ?? data.name;
    console.log(`No${i}の${japaneseName}の登録が完了`);
    await prisma.pokemon.create({
      data: {
        name: data.name,
        japaneseName,
        imageUrl: data.sprites.other["official-artwork"].front_default,
        type: data.types.map(
          (item: { type: { name: string } }) => item.type.name,
        ),
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
