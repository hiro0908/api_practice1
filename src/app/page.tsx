"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PokemonListItem } from "@/src/domain/pokemon/pokemon";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { PokedexIntro } from "@/src/components/ui/PokedexIntro";
import { Pagination } from "@/src/components/ui/Pagination";

import { useRouter } from "next/navigation";

import { DisplayPokemonImage } from "../components/ui/DisplayPokemonImage";

const SCROLL_POSITION_KEY = "pokedexHomeScrollY";
const PAGE_POSITION_KEY = "pokedexHomePage";
const PAGE_ITEM = 20;

export default function Home() {
  const router = useRouter();
  const hasRestoredScroll = useRef(false);

  const [pokemonList, setPokemonList] = useState<
    {
      number: string;
      name: string;
      japaneseName: string;
      imageUrl: string | null;
    }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window === "undefined") return 1;
    const savedPage = sessionStorage.getItem(PAGE_POSITION_KEY);
    return savedPage ? Number(savedPage) : 1;
  });
  useEffect(() => {
    // ブラウザ標準の自動スクロール復元は、一覧が非同期取得のため
    // コンテンツが揃う前に働いてしまうので無効化し、自前で復元する
    window.history.scrollRestoration = "manual";
    const fetchPokemonList = async () => {
      const response = await fetch(`/api/pokemon`);
      const json = await response.json();
      const nameList = json.map((pokemon: PokemonListItem) => ({
        name: pokemon.name,
        number: pokemon.pokeApiId,
        japaneseName: pokemon.japaneseName,
        imageUrl: pokemon.imageUrl,
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
    sessionStorage.setItem(PAGE_POSITION_KEY, String(currentPage));
    router.push(`/pokemon/${number}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const totalPages = Math.max(1, Math.ceil(pokemonList.length / PAGE_ITEM));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const currentPageList = pokemonList.slice(
    (safeCurrentPage - 1) * PAGE_ITEM,
    safeCurrentPage * PAGE_ITEM,
  );

  return (
    <div className="min-h-screen pb-12">
      <PokedexIntro />
      <PageHeader />
      <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 sm:gap-5 sm:p-6 md:grid-cols-4 lg:grid-cols-5">
        {currentPageList.map((pokemon) => (
          <button
            key={pokemon.number}
            type="button"
            onClick={() => handleSelectPokemon(pokemon.number)}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-3 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-red-300 hover:shadow-xl dark:hover:border-red-800 cursor-pointer"
          >
            <div className="absolute top-2 right-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground group-hover:bg-red-100 group-hover:text-red-500 dark:group-hover:bg-red-950 dark:group-hover:text-red-400">
              No.{pokemon.number}
            </div>
            <div className="mx-auto flex h-[140px] w-[140px] items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-red-50 dark:group-hover:bg-red-950/40">
              <DisplayPokemonImage data={pokemon} form={"Normal"} />
            </div>
            <div className="mt-2 truncate text-center text-sm font-bold text-card-foreground">
              {pokemon.japaneseName}
            </div>
          </button>
        ))}
      </div>
      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
