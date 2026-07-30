"use client";
import { use } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { pokemonTypeStyleDictionary } from "@/src/domain/pokemon/pokemonTypeStyle";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { BaseStatBarChart } from "@/src/components/ui/id/BaseStatBarChart";
import { TypeEffectivenessSection } from "@/src/components/ui/id/TypeEffectivenessSection";
import { TypeBadge } from "@/src/components/ui/id/TypeBadge";
import { RolingBollAnimation } from "@/src/components/ui/id/RolingBollAnimation";
import { Button } from "@/src/components/ui/button";
import { RarityBadge } from "@/src/components/ui/id/RarityBadge";
import { EvolutionTreeNode } from "@/src/components/ui/id/EvolutionTreeNode";
import { DisplayPokemonImage } from "@/src/components/ui/DisplayPokemonImage";
import {
  Sparkles,
  Ruler,
  Weight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  PokemonData,
  PokemonForm,
  PokemonEvolutionNode,
} from "@/src/domain/pokemon/pokemon";

const ExampleDrawer = dynamic(
  () => import("@/src/components/ui/id/DisplayExplain"),
  { ssr: false },
);

type Params = {
  id: string;
};

export default function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const [data, setData] = useState<PokemonData | null>(null);
  const [maxPokeApiId, setMaxPokeApiId] = useState<number | null>(null);
  const [specialPokeStyleList, setSpecialPokeStyleList] = useState<
    PokemonForm[]
  >([]);
  const [evolutionTree, setEvolutionTree] =
    useState<PokemonEvolutionNode | null>(null);
  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch(`/api/pokemon/${id}`);
      const data = await response.json();
      setData(data.pokemon);
      setMaxPokeApiId(data.maxPokeApiId);
    };
    fetchPokemon();
  }, [id]);
  useEffect(() => {
    if (!data) return;
    const fetchForm = async () => {
      const response = await fetch(`/api/pokemon/forms/${data.pokedexId}`);
      const formData = await response.json();
      setSpecialPokeStyleList(formData.forms);
    };
    fetchForm();
  }, [data]);
  useEffect(() => {
    if (!data) return;
    const fetchEvolution = async () => {
      const response = await fetch(`/api/pokemon/evolution/${data.pokedexId}`);
      const evolutionData = await response.json();
      setEvolutionTree(evolutionData.tree ?? null);
    };
    fetchEvolution();
  }, [data]);
  const [pokemonForm, setPokemonForm] = useState<"Normal" | "Special">(
    "Normal",
  );
  const handleClick = () => {
    setPokemonForm((prev) => (prev === "Normal" ? "Special" : "Normal"));
  };
  const router = useRouter();
  const currentPokeApiId = Number(id);
  const hasPrev = currentPokeApiId > 1;
  const hasNext = maxPokeApiId !== null && currentPokeApiId < maxPokeApiId;
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrev) {
        router.push(`/pokemon/${currentPokeApiId - 1}`);
      } else if (e.key === "ArrowRight" && hasNext) {
        router.push(`/pokemon/${currentPokeApiId + 1}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasPrev, hasNext, currentPokeApiId, router]);
  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <RolingBollAnimation />
        <div className="font-bold text-slate-500">Now loading...</div>
      </div>
    );
  }
  const typeNames: string[] = data.type;
  const primaryTypeColor =
    pokemonTypeStyleDictionary[data.type[0]]?.color ?? "#A8A878";
  const bannerGradient = `linear-gradient(135deg, color-mix(in srgb, ${primaryTypeColor} 65%, black), color-mix(in srgb, ${primaryTypeColor} 30%, black))`;
  const normalAbilities = data.abilities.filter((ability) => !ability.isHidden);
  const hiddenAbilities = data.abilities.filter((ability) => ability.isHidden);
  return (
    <div className="min-h-screen pb-12">
      <PageHeader />
      <div className="mx-4 flex items-center gap-2 sm:mx-8 sm:gap-4">
        {hasPrev && (
          <button
            type="button"
            onClick={() => router.push(`/pokemon/${currentPokeApiId - 1}`)}
            aria-label="前のポケモン"
            className="flex h-24 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground shadow-sm transition-colors duration-150 hover:bg-accent hover:text-card-foreground sm:h-32 sm:w-12"
          >
            <ChevronLeft />
          </button>
        )}
        <div className="my-6 flex-1 overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
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
              {data.formDisplayName ? "(" + data.formDisplayName + ")" : ""}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.type.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-[260px] w-full items-center justify-center rounded-2xl bg-muted">
                <DisplayPokemonImage data={data} form={pokemonForm} />
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
              <div className="flex flex-wrap gap-4 text-sm font-bold text-card-foreground">
                <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
                  <Ruler size={16} className="text-muted-foreground" />
                  高さ {data.height / 10}m
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
                  <Weight size={16} className="text-muted-foreground" />
                  重さ {data.weight / 10}kg
                </div>
                <RarityBadge
                  legendary={data.legendary}
                  mythical={data.mythical}
                />
              </div>

              <div>
                <div className="mb-1.5 text-sm font-bold text-muted-foreground">
                  特性
                </div>
                <div className="flex flex-wrap gap-2">
                  {normalAbilities.map((ability) => (
                    <div
                      key={ability.id}
                      className="rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-card-foreground shadow-sm transition-colors duration-150 hover:bg-accent"
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
                      className="rounded-full border border-dashed border-border bg-muted px-3 py-1 text-xs font-bold text-muted-foreground transition-colors duration-150 hover:bg-accent"
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
                <div className="mb-1.5 text-sm font-bold text-muted-foreground">
                  ポケモンの説明
                </div>
                <div className="rounded-xl bg-slate-900 p-4 font-mono text-sm leading-relaxed text-green-400 shadow-inner ring-1 ring-border">
                  {!data.description ? "謎に包まれている" : data.description}
                </div>
              </div>
              {specialPokeStyleList.length > 1 && (
                <div>
                  <div className="mb-1.5 text-sm font-bold text-muted-foreground">
                    フォーム
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {specialPokeStyleList.map((form) => {
                      const isActive = form.pokeApiId === Number(id);
                      return (
                        <button
                          key={form.pokeApiId}
                          onClick={() =>
                            router.push(`/pokemon/${form.pokeApiId}`)
                          }
                          className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border px-3 py-2 transition-colors duration-150 ${
                            isActive
                              ? "border-primary bg-primary/10 shadow-sm"
                              : "border-border bg-card hover:bg-accent"
                          }`}
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            {form.imageUrl && (
                              <Image
                                src={form.imageUrl}
                                alt={form.japaneseName}
                                width={44}
                                height={44}
                              />
                            )}
                          </div>
                          <div
                            className={`text-xs font-bold ${
                              isActive ? "text-primary" : "text-card-foreground"
                            }`}
                          >
                            {form.formDisplayName || form.japaneseName}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ステータス */}
          <div className="grid grid-cols-1 gap-6 border-t border-border p-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="text-center font-bold text-card-foreground">
                ポケモン進化
              </div>
              <div className="mt-3">
                {evolutionTree &&
                  (evolutionTree.evolvesTo.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground">
                      進化はありません
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <EvolutionTreeNode
                        node={evolutionTree}
                        currentPokedexId={data.pokedexId}
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <BaseStatBarChart stats={data.stats} />
              <TypeEffectivenessSection types={typeNames} />
            </div>
          </div>
        </div>
        {hasNext && (
          <button
            type="button"
            onClick={() => router.push(`/pokemon/${currentPokeApiId + 1}`)}
            aria-label="次のポケモン"
            className="flex h-24 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground shadow-sm transition-colors duration-150 hover:bg-accent hover:text-card-foreground sm:h-32 sm:w-12"
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}
