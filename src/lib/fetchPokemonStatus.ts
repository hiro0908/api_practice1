import type { PokemonStat } from "@/src/types/pokemon";
import type { DataPoint } from "@/src/components/RaderChartComponent";
export function fetchPokemonStatus(pokemonStats: PokemonStat[]): DataPoint[] {
  const getStat = (name: string) =>
    pokemonStats.find((stat) => stat.name === name)?.value ?? 0;

  return [
    {
      subject: "HP",
      A: getStat("hp"),
      fullMark: 200,
    },
    {
      subject: "攻撃",
      A: getStat("attack"),
      fullMark: 200,
    },
    {
      subject: "特攻",
      A: getStat("special-attack"),
      fullMark: 200,
    },
    {
      subject: "すばやさ",
      A: getStat("speed"),
      fullMark: 200,
    },
    {
      subject: "特防",
      A: getStat("special-defense"),
      fullMark: 200,
    },
    {
      subject: "防御",
      A: getStat("defense"),
      fullMark: 200,
    },
  ];
}
