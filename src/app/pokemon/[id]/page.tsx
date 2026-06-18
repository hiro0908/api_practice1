"use client";
import { use } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PokemonData} from "@/src/types/pokemon";
type Params = {
  id: string;
};
const typeNamesList: { eng: string; ja: string }[] = [
  { eng: "normal", ja: "ノーマル" },
  { eng: "fire", ja: "ほのう" },
  { eng: "water", ja: "みず" },
  { eng: "grass", ja: "くさ" },
  { eng: "electric", ja: "でんき" },
  { eng: "ice", ja: "こおり" },
  { eng: "fighting", ja: "かくとう" },
  { eng: "poison", ja: "どく" },
  { eng: "ground", ja: "じめん" },
  { eng: "flying", ja: "ひこう" },
  { eng: "psychic", ja: "エスパー" },
  { eng: "bug", ja: "むし" },
  { eng: "rock", ja: "いわ" },
  { eng: "ghost", ja: "ゴースト" },
  { eng: "dragon", ja: "ドラゴン" },
  { eng: "dark", ja: "あく" },
  { eng: "steel", ja: "はがね" },
  { eng: "fairy", ja: "フェアリー" },
];

export default function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const [data, setData] = useState<PokemonData | null>(null);
  useEffect(() => {
    const fetchPokemon = async () => {
      //APIにリクエストを送信
      const response = await fetch(`/api/pokemon/${id}`);
      const data = await response.json();
      setData(data);
    };
    fetchPokemon();
  }, [id]);
  if (!data) {
    return <div>Loading...</div>;
  }
  const typeNames: string[]=[data.type];
  const typeNamesJa: string[] = typeNames.map(
    (typeName) => typeNamesList.find((type) => type.eng === typeName)?.ja || "",
  );

  return (
    <div>
      <h1 className="text-center">
        名前：{data.name}/タイプ：{typeNamesJa}
      </h1>
      <h1>
        高さ：{data.height / 10}m/体重：{data.weight / 10}kg
      </h1>
      <Image
        src={data.imageUrl}
        alt={data?.name}
        width={300}
        height={300}
      />
    </div>
  );
}
