"use client";
import { useEffect, useState } from "react";
import React from "react";
import type { PokemonListItem } from "@/src/types/pokemon";

import { useRouter } from "next/navigation";

export default function Home() {
  //ルーティング設定
  const router = useRouter();
  //外部から入力した数値の格納
  // //調査結果のための格納
  // const [searchNumber, setSearchNumber] = useState("0");
  // const [data, setData] = useState<PokemonData | null>(null);
  // const [isClicked, setIsClicked] = useState(false);
  // const NumberSearch = (number: string = "0") => {
  //   console.log("検索:", number);
  //   setSearchNumber(number);
  //   setIsClicked(true);
  // };

  // useEffect(() => {
  //   const fetchPokemon = async () => {
  //     //APIにリクエストを送信
  //     const response = await fetch(`/api/pokemon/${searchNumber}`);
  //     const data = await response.json();
  //     setData(data);
  //   };
  //   fetchPokemon();
  // }, [searchNumber]);

  const [pokemonList, setPokemonList] = useState<
    { number: string; name: string }[]
  >([]);

  useEffect(() => {
    // if (pokemonCount === null) return;
    const fetchPokemonList = async () => {
      const response = await fetch(`/api/pokemon`);
      const json = await response.json();
      const nameList = json.map((pokemon: PokemonListItem) => ({
        name: pokemon.japaneseName,
        number: pokemon.id,
      }));
      setPokemonList(nameList);
    };
    fetchPokemonList();
  }, []);

  return (
    <div>
      現在存在するポケモン番号を入力すると検索できます
      <br />
      今回は一時的にリストによる検索表示を行います
      {pokemonList.map((pokemon) => (
        <div key={pokemon.number}>
          {pokemon.number} :
          <button
            type="button"
            onClick={() => router.push(`/pokemon/${pokemon.number}`)}
          >
            {pokemon.name}
          </button>
        </div>
      ))}
    </div>
  );
}
