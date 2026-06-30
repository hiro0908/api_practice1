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
  deleteAllPokemonData();
  registerAllPokeomonData();
}
insertData();
