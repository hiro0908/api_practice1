export const getPokemonMaxNumberUrl =()=>{
    return "https://pokeapi.co/api/v2/pokemon"
};
export const getPokemonData =(id:number)=>{
    return `https://pokeapi.co/api/v2/pokemon/${id}`
};
export const getAllPokemonList=(maximam:number)=>{
    return `https://pokeapi.co/api/v2/pokemon?limit=${maximam}`
}