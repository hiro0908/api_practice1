"use client";
import { use } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PokemonData } from "@/src/types/pokemon";
import RadarChartComponent from "@/src/components/RaderChartComponent";
import { fetchPokemonStatus } from "@/src/lib/fetchPokemonStatus";
import { ButtonGroupInput } from "@/src/components/ui/ButtonGroupInput";
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
  const [inputNumber, setInputNumber] = useState("0");
  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch(`/api/pokemon/${id}`);
      const data = await response.json();
      setData(data);
    };
    fetchPokemon();
  }, [id]);

  if (!data) {
    return <div>Loading...</div>;
  }
  const status = fetchPokemonStatus(data.stats);
  const typeNames: string[] = data.type;
  const typeNamesJa: string[] = typeNames.map(
    (typeName) => typeNamesList.find((type) => type.eng === typeName)?.ja || "",
  );

  return (
    <div>
      <div>
        <h1 className="text-center text-4xl font-bold">ポケモン図鑑</h1>
        <div className="flex flex-col items-end">
          <ButtonGroupInput value={inputNumber} onChange={setInputNumber} />
        </div>
      </div>
      <div className="grid grid-cols-2 w-full border-4 divide-x-4">
        <div className="grid grid-cols-2 w-full">
        <div>
          <div className="font-bold">No.{data.id}</div>
          <div className="font-bold">{data.japaneseName}</div>
          <div className="font-bold">タイプ：{typeNamesJa}</div>
          <div className="font-bold">
            高さ：{data.height / 10}m/体重：{data.weight / 10}kg
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Image
            src={data.imageUrl}
            alt={data?.name}
            width={300}
            height={300}
          />

        </div>
        </div>
        <div>
          <div className="text_center font-bold">ポケモンステータスチャート</div>
          <RadarChartComponent status={status} />
        </div>
      </div>
    </div>
  );
}
