import {
  registerAllPokeomonData,
  deleteAllPokemonData,
} from "@/src/infrastructure/db/dbFunction";

import dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});

console.log("DATABASE_URL =", process.env.DATABASE_URL);

export default async function insertData() {
  await deleteAllPokemonData();
  await registerAllPokeomonData();
}
insertData().catch((err) => {
  console.error("ポケモンデータの登録処理が失敗しました", err);
  process.exitCode = 1;
});
