export type PokemonStat={
  base_stat:number;
  stat:{
    name:string;
  };
}
export type PokemonType={
  slot:number;
  type:{
    name:string;
    url:string;
  };
  weight:number;
};

export type PokemonData = {
  name: string;
  height: number;
  weight: number;

  stats: PokemonStat[];

  types: PokemonType[];

  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
};

