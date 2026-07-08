"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PokemonListItem } from "@/src/domain/pokemon/pokemon";
import Image from "next/image";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { PokedexIntro } from "@/src/components/ui/PokedexIntro";

import { useRouter } from "next/navigation";

const SCROLL_POSITION_KEY = "pokedexHomeScrollY";

export default function Home() {
  const router = useRouter();
  const hasRestoredScroll = useRef(false);

  const [pokemonList, setPokemonList] = useState<
    {
      number: string;
      name: string;
      japaneseName: string;
      imageUrl: string | null;
      formName: string | null;
    }[]
  >([]);
  useEffect(() => {
    // ブラウザ標準の自動スクロール復元は、一覧が非同期取得のため
    // コンテンツが揃う前に働いてしまうので無効化し、自前で復元する
    window.history.scrollRestoration = "manual";
    const fetchPokemonList = async () => {
      const response = await fetch(`/api/pokemon`);
      const json = await response.json();
      const nameList = json.map((pokemon: PokemonListItem) => ({
        name: pokemon.name,
        number: pokemon.id,
        japaneseName: pokemon.japaneseName,
        imageUrl: pokemon.imageUrl,
        formName: pokemon.formName,
      }));
      setPokemonList(nameList);
    };
    fetchPokemonList();
  }, []);

  useLayoutEffect(() => {
    if (hasRestoredScroll.current || pokemonList.length === 0) return;
    hasRestoredScroll.current = true;
    const savedScrollY = sessionStorage.getItem(SCROLL_POSITION_KEY);
    if (savedScrollY) {
      window.scrollTo(0, Number(savedScrollY));
    }
  }, [pokemonList]);

  const handleSelectPokemon = (number: string) => {
    sessionStorage.setItem(SCROLL_POSITION_KEY, String(window.scrollY));
    router.push(`/pokemon/${number}`);
  };

  return (
    <div className="min-h-screen pb-12">
      <PokedexIntro />
      <PageHeader />
      <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 sm:gap-5 sm:p-6 md:grid-cols-4 lg:grid-cols-5">
        {pokemonList
          .filter((pokemon) => pokemon.formName == null)
          .map((pokemon) => (
            <button
              key={pokemon.number}
              type="button"
              onClick={() => handleSelectPokemon(pokemon.number)}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-red-300 hover:shadow-xl"
            >
              <div className="absolute top-2 right-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-400 group-hover:bg-red-100 group-hover:text-red-500">
                No.{pokemon.number}
              </div>
              <div className="mx-auto flex h-[140px] w-[140px] items-center justify-center rounded-full bg-gradient-to-b from-slate-100 to-slate-200 transition-colors group-hover:from-red-50 group-hover:to-red-100">
                {pokemon.imageUrl ? (
                  <Image
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    width={120}
                    height={120}
                    className="drop-shadow-md transition-transform group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-[120px] w-[120px] items-center justify-center text-xs text-slate-400">
                    no image
                  </div>
                )}
              </div>
              <div className="mt-2 truncate text-center text-sm font-bold text-slate-700">
                {pokemon.japaneseName}
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
