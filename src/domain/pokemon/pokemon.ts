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
  description: string;
  difImageUrl: string | null;
  abilities: PokemonAbility[];
  isDefault:boolean;
};

export type PokemonListItem = {
  id: number;
  name: string;
  japaneseName: string;
  imageUrl: string | null;
  formDisplayName: string | null;
};

export type PokemonAbility = {
  id: number;
  name: string;
  description: string | null;
  slot: number;
  isHidden: boolean;
  pokemonId: number;
};
