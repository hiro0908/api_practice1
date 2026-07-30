import { registerAllEvolutionData } from "@/src/infrastructure/db/dbFunction";

import dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});

registerAllEvolutionData().catch((err) => {
  console.error("進化データの登録処理が失敗しました", err);
  process.exitCode = 1;
});
