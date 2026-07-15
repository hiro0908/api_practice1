"use client";
import { use } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Sparkles, Ruler, Weight } from "lucide-react";
import { PokemonData } from "@/src/domain/pokemon/pokemon";
import { pokemonTypeStyleDictionary } from "@/src/domain/pokemon/pokemonTypeStyle";
import RadarChartComponent from "@/src/components/ui/RaderChartComponent";
import { fetchPokemonStatus } from "@/src/components/ui/fetchPokemonStatus";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { BaseStatBarChart } from "@/src/components/ui/BaseStatBarChart";
import { TypeEffectivenessSection } from "@/src/components/ui/TypeEffectivenessSection";
import { TypeBadge } from "@/src/components/ui/TypeBadge";
import { RolingBollAnimation } from "@/src/components/ui/RolingBollAnimation";
import { Button } from "@/src/components/ui/button";

const ExampleDrawer = dynamic(
  () => import("@/src/components/ui/DisplayExplain"),
  { ssr: false },
);

type Params = {
  id: string;
};

export default function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const [data, setData] = useState<PokemonData | null>(null);
  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch(`/api/pokemon/${id}`);
      // if (!response.ok) {
      //   setNotFound(true);
      //   return;
      // }
      const data = await response.json();
      setData(data);
    };
    fetchPokemon();
  }, [id]);
  const [pokemonForm, setPokemonForm] = useState<"Normal" | "Special">(
    "Normal",
  );
  const handleClick = () => {
    setPokemonForm((prev) => (prev === "Normal" ? "Special" : "Normal"));
  };
  const [erroredImageSrc, setErroredImageSrc] = useState<string | null>(null);
  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <RolingBollAnimation />
        <div className="font-bold text-slate-500">Now loading...</div>
      </div>
    );
  }
  const status = fetchPokemonStatus(data.stats);
  const typeNames: string[] = data.type;
  const primaryTypeColor =
    pokemonTypeStyleDictionary[data.type[0]]?.color ?? "#A8A878";
  const bannerGradient = `linear-gradient(135deg, color-mix(in srgb, ${primaryTypeColor} 65%, black), color-mix(in srgb, ${primaryTypeColor} 30%, black))`;
  const normalAbilities = data.abilities.filter((ability) => !ability.isHidden);
  const hiddenAbilities = data.abilities.filter((ability) => ability.isHidden);

  return (
    <div className="min-h-screen pb-12">
      <PageHeader />
      <div className="mx-4 my-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl sm:mx-8">
        {/* バナー */}
        <div
          className="px-6 pt-6 pb-8 sm:px-10"
          style={{ background: bannerGradient }}
        >
          <div className="rounded-full bg-white/25 px-3 py-0.5 text-xs font-bold text-white w-fit backdrop-blur-sm">
            No.{data.id}
          </div>
          <div className="mt-1 text-3xl font-extrabold text-white drop-shadow-sm sm:text-4xl">
            {data.japaneseName}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.type.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-[260px] w-full items-center justify-center rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200">
              {(() => {
                const currentImageSrc =
                  pokemonForm === "Normal" ? data.imageUrl : data.difImageUrl;
                return currentImageSrc &&
                  currentImageSrc !== erroredImageSrc ? (
                  <Image
                    src={currentImageSrc}
                    alt={data.name}
                    width={220}
                    height={220}
                    className="drop-shadow-lg"
                    onError={() => setErroredImageSrc(currentImageSrc)}
                  />
                ) : (
                  <div className="flex h-[220px] w-[220px] items-center justify-center text-sm text-slate-400">
                    no image
                  </div>
                );
              })()}
            </div>
            <Button
              onClick={handleClick}
              variant={pokemonForm === "Special" ? "default" : "outline"}
              className="gap-1.5 cursor-pointer transition-opacity hover:opacity-80"
            >
              <Sparkles size={16} />
              {pokemonForm === "Special" ? "色違い表示中" : "色違いを表示"}
            </Button>
          </div>

          <div className="flex flex-col gap-4 md:col-span-2">
            <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-700">
              <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                <Ruler size={16} className="text-slate-500" />
                高さ {data.height / 10}m
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                <Weight size={16} className="text-slate-500" />
                重さ {data.weight / 10}kg
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-slate-400">
                世代などのタグ（実装予定）
              </div>
            </div>

            <div>
              <div className="mb-1.5 text-sm font-bold text-slate-500">
                特性
              </div>
              <div className="flex flex-wrap gap-2">
                {normalAbilities.map((ability) => (
                  <div
                    key={ability.id}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm transition-colors duration-150 hover:border-slate-300 hover:bg-slate-50"
                  >
                    <ExampleDrawer
                      title={ability.name}
                      explain={ability.description}
                    />
                  </div>
                ))}
                {hiddenAbilities.map((ability) => (
                  <div
                    key={ability.id}
                    className="rounded-full border border-dashed border-slate-300 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500 transition-colors duration-150 hover:border-slate-400 hover:bg-slate-100"
                  >
                    <ExampleDrawer
                      title={`${ability.name}（隠れ特性）`}
                      explain={ability.description}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1.5 text-sm font-bold text-slate-500">
                ポケモンの説明
              </div>
              <div className="rounded-xl bg-slate-900 p-4 font-mono text-sm leading-relaxed text-green-400 shadow-inner ring-1 ring-slate-700">
                {!data.description ? "謎に包まれている" : data.description}
              </div>
            </div>
          </div>
        </div>

        {/* ステータス */}
        <div className="grid grid-cols-1 gap-6 border-t border-slate-100 p-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-center font-bold text-slate-700">
              ポケモンステータスチャート
            </div>
            <RadarChartComponent status={status} />
          </div>
          <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <BaseStatBarChart stats={data.stats} />
            <TypeEffectivenessSection types={typeNames} />
          </div>
        </div>
      </div>
    </div>
  );
}
