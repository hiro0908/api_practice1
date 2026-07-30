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
  isDefault: boolean;
  formDisplayName: string | null;
  pokedexId: number;
  legendary: boolean;
  mythical: boolean;
};

export type PokemonListItem = {
  pokeApiId: number;
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

export type PokemonForm = {
  pokeApiId: number;
  formDisplayName: string;
  imageUrl: string | null;
  japaneseName: string;
};

export type PokemonEvolutionNode = {
  pokedexId: number;
  pokeApiId: number;
  name: string;
  japaneseName: string;
  imageUrl: string | null;
  evolvesTo: PokemonEvolutionNode[];
};
