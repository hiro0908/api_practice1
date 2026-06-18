import prisma from "@/src/lib/prisma"
import "dotenv/config"
export default async function insertData(){
    console.log("画面の読み込みが始まった") 
    const res=await fetch("https://pokeapi.co/api/v2/pokemon/1");
    const data = await res.json();

    await prisma.pokemon.create({
        data:{
            name:data.name,
            imageUrl:data.sprites.other["official-artwork"].front_default,
            type:data.type,
            stats:{
                create:data.stats.map((s:{stat:{name:string},base_stat:number})=>({
                    name:  s.stat.name,
                    value: s.base_stat,
                })),
            },
        },
    })
    console.log("ここまで完了")   
}
insertData()