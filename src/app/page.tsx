"use client";
import { useEffect, useState } from "react";
import type { PokemonListItem } from "@/src/types/pokemon";
import Image from "next/image";
import { ButtonGroupInput } from "@/src/components/ui/ButtonGroupInput";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [pokemonList, setPokemonList] = useState<
    { number: string; name: string; japaneseName: string; imageUrl: string }[]
  >([]);
  const [inputNumber, setInputNumber] = useState("0");
  useEffect(() => {
    // if (pokemonCount === null) return;
    const fetchPokemonList = async () => {
      const response = await fetch(`/api/pokemon`);
      const json = await response.json();
      const nameList = json.map((pokemon: PokemonListItem) => ({
        name: pokemon.name,
        number: pokemon.id,
        japaneseName: pokemon.japaneseName,
        imageUrl: pokemon.imageUrl,
      }));
      setPokemonList(nameList);
    };
    fetchPokemonList();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-center text-4xl font-bold">ポケモン図鑑</h1>
        <div className="flex flex-col items-end">
          <ButtonGroupInput value={inputNumber} onChange={setInputNumber} />
        </div>
      </div>     
      <div>
        {pokemonList.map((pokemon) => (
          <div
            key={pokemon.number}
            className="inline-block border-4 border-solid"
          >
            <div>
              <button
                type="button"
                onClick={() => router.push(`/pokemon/${pokemon.number}`)}
              >
                {pokemon.number} :{pokemon.japaneseName}
                <div>
                  {
                    <Image
                      src={pokemon.imageUrl}
                      alt={pokemon.name}
                      width={300}
                      height={300}
                    />
                  }
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
