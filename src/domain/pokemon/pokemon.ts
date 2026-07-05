export type PokemonStat = {
  id: number;
  name: string;
  value: number;
  pokemonId: number;
};

export type PokemonData = {
  id: number;
  name: string;
  imageUrl: string | null;
  japaneseName: string;
  type: string[];
  stats: PokemonStat[];
  height: number;
  weight: number;
  discription: string;
  difImageUrl: string | null;
};

export type PokemonListItem = {
  id: number;
  name: string;
  japaneseName: string;
  imageUrl: string | null;
  formName: string | null;
};
