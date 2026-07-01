"use client";
import { use } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PokemonData } from "@/src/domain/pokemon/pokemon";
import RadarChartComponent from "@/src/components/ui/RaderChartComponent";
import { fetchPokemonStatus } from "@/src/components/ui/fetchPokemonStatus";
import { pokemonTypeNamesList } from "@/src/domain/pokemon/pokemonTypeDictionary";
import { PageHeader } from "@/src/components/ui/PageHeader";
type Params = {
  id: string;
};

const typeNamesList = pokemonTypeNamesList;

export default function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const [data, setData] = useState<PokemonData | null>(null);
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
      <PageHeader/>
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
          <div className="text_center font-bold">
            ポケモンステータスチャート
          </div>
          <RadarChartComponent status={status} />
        </div>
      </div>
    </div>
  );
}
