export type PokemonStat = {
    id: number;
    name: string;
    value: number;
    pokemonId:number;
};

export type PokemonData = {
  id:number;
  name: string;
  imageUrl:string;
  type: string;
  stats:PokemonStat[];
  height:number;
  weight:number;

};

export type PokemonListItem={
  id:number
  name:string;
}


// export type PokemonType = {
//   type:string;
// };

// export type PokemonData = {
//   name: string;
//   height: number;
//   weight: number;

//   stats: PokemonStat[];

//   type: PokemonType[];

//   sprites: {
//     other: {
//       "official-artwork": {
//         front_default: string;
//       };
//     };
//   };
// };


