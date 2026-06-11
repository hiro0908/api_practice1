import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    plugins:{
      "@stylistic":stylistic,
    },
  },
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      globals: {...globals.browser, ...globals.node},
      parserOptions:{projectService:true}
      } 
  },
  tseslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    rules:{
      "no-console":"warn",
      camelcase: ["warn", { properties: "never" }],
      "@stylistic/semi": ["warn", "always"], 
      "@typescript-eslint/switch-exhaustiveness-check":"warn",
    },
  },
  pluginReact.configs.flat.recommended,
]);
