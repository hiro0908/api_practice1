"use client";
import { use } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PokemonData } from "@/src/domain/pokemon/pokemon";
import RadarChartComponent from "@/src/components/ui/RaderChartComponent";
import { fetchPokemonStatus } from "@/src/components/ui/fetchPokemonStatus";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { BaseStatBarChart } from "@/src/components/ui/BaseStatBarChart";
import { TypeEffectivenessSection } from "@/src/components/ui/TypeEffectivenessSection";
import { TypeBadge } from "@/src/components/ui/TypeBadge";
import { RolingBollAnimation } from "@/src/components/ui/RolingBollAnimation";
type Params = {
  id: string;
};

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
  const [pokemonForm, setPokemonForm] = useState<"Normal" | "Special">(
    "Normal",
  );
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const style: React.CSSProperties = {
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: isHovered ? "#3b82f6" : "#e5e7eb",
    color: isHovered ? "#ffffff" : "#1f2937",
    border: "none",
  };
  const [changeText, setChangeText] = useState<"色違い" | "通常">("色違い");
  const handleClick = () => {
    setPokemonForm((prev) => (prev === "Normal" ? "Special" : "Normal"));
    setChangeText((pret) => (pret === "色違い" ? "通常" : "色違い"));
  };

  if (!data) {
    return <div>{RolingBollAnimation()}Now loadiong...</div>;
  }
  console.log(data);
  const status = fetchPokemonStatus(data.stats);
  const typeNames: string[] = data.type;
  console.log(data.abilities);
  return (
    <div>
      <PageHeader />
      <div className="border-4 my-8 mx-8 bg-red-300">
        <div className=" border-4 mx-8 my-8  grid grid-cols-3 gap-4 bg-white">
          <div className="grid grid-rows-2 gap-4">
            <div>
              <div className="font-bold">No.{data.id}</div>
              <div className="font-bold">{data.japaneseName}</div>
              <div className="font-bold">
                タイプ：{" "}
                {data.type.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
              <div className="font-bold">
                高さ：{data.height / 10}m/体重：{data.weight / 10}kg
              </div>
              <div>特性</div>

              {data.abilities
                .filter((ability) => !ability.isHidden)
                .map((ability) => (
                  <div key={ability.id}>{ability.name}</div>
                ))}

              {data.abilities
                .filter((ability) => ability.isHidden)
                .map((ability) => (
                  <div key={ability.id}>{ability.name}（隠れ特性）</div>
                ))}
            </div>
            <div>
              <div className="font-bold">ポケモンの説明</div>
              <div>{data.description}</div>
            </div>
          </div>
          <div>
            {data.imageUrl && pokemonForm == "Normal" ? (
              <Image
                src={data.imageUrl}
                alt={data.name}
                width={500}
                height={500}
              />
            ) : data.difImageUrl && pokemonForm == "Special" ? (
              <Image
                src={data.difImageUrl}
                alt={data.name}
                width={500}
                height={500}
              />
            ) : (
              <div
                className="flex items-center justify-center bg-gray-200"
                style={{ width: 300, height: 300 }}
              >
                no image
              </div>
            )}
          </div>
          <div className="grid grid-rows-2">
            <div>
              <div className="font-bold">タグ表記</div>
              <div>世代などのタグを実装予定</div>
            </div>
            <div>
              <div className="font-bold">
                スタイル:{changeText == "色違い" ? "ノーマル" : "色違い"}
              </div>
              <button
                onClick={handleClick}
                className="rounded bg-blue-500 px-3 py-1 text-white"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={style}
              >
                {changeText}を表示
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 border-4 my-8 mx-8 bg-white">
          <div>
            <div className="text_center font-bold mx-8 my-8">
              ポケモンステータスチャート
            </div>
            <RadarChartComponent status={status} />
          </div>
          <div className="grid grid-rows-2">
            <BaseStatBarChart stats={data.stats} />

            <TypeEffectivenessSection types={typeNames} />
          </div>
        </div>
      </div>
    </div>
  );
}
