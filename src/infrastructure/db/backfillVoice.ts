import { registerAllVoiceData } from "@/src/infrastructure/db/dbFunction";

import dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});

registerAllVoiceData().catch((err) => {
  console.error("鳴き声データの登録処理が失敗しました", err);
  process.exitCode = 1;
});
