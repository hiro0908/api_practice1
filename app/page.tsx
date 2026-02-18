"use client";
import {useEffect, useState } from "react";
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ButtonGroupInput } from "@/components/ui/ButtonGroupInput"


const languageList:{value: string;label: string}[]=[
  {value: "ja",label:"日本語"},
  {value:"ja=Hrkt",label:"にほんご"},
  {value:"en",label:"English"},
  {value:"fr",label:"french"},
  {value:"it",label:"italiano"},
];

const typeNamesList:{eng:string,ja:string}[]=[
  {eng:"normal",ja:"ノーマル"},
  {eng:"fire",ja:"ほのう"},
  {eng:"water",ja:"みず"},
  {eng:"grass",ja:"くさ"},
  {eng:"electric",ja:"でんき"},
  {eng:"ice",ja:"こおり"},
  {eng:"fighting",ja:"かくとう"},
  {eng:"poison",ja:"どく"},
  {eng:"ground",ja:"じめん"},
  {eng:"flying",ja:"ひこう"},
  {eng:"psychic",ja:"エスパー"},
  {eng:"bug",ja:"むし"},
  {eng:"rock",ja:"いわ"},
  {eng:"ghost",ja:"ゴースト"},
  {eng:"dragon",ja:"ドラゴン"},
  {eng:"dark",ja:"あく"},
  {eng:"steel",ja:"はがね"},
  {eng:"fairy",ja:"フェアリー"}
]


const isShiny:boolean=false;
const imageType:string="正面"
const imageTypeList:{type: string, url: string}[]=[
  {type:"公式イラスト",url:"/other/official-artwoek"},
  {type:"正面",url:""},
  {type:"側面",url:"/other/home"},
  {type:"ポケモンホーム",url:"/other/home"}
]
const imageTypeUrl=imageTypeList.find((item)=>item.type==imageType)?.url;
const shiny:string=isShiny?"/shiny":"";
// const url:string=`https://raw.githubusercontent.com/PokeAPI/sporetes/master/sprotes/master/pokemon${imageTypeUrl}${shiny}/${dexNumber}.png`



interface DataPoint {
  subject: string; // 軸のラベル
  A: number;       // 1つ目のデータセットの値      // 2つ目のデータセットの値 (必要に応じて削除・変更可能)
  fullMark: number; // その項目の最大値（スケール調整用）
}


export default function Home() {
  //外部から入力した数値の格納
  const [inputNumber,setInputNumber] =useState("1010");
  //調査結果のための格納
  const [searchNumber,setSearchNumber] =useState("1010");
  const [data,setData]= useState<any>(null);  const [isClicked,setIsClicked] = useState(false);
  const NumberSearch = () => {
    console.log("検索:", inputNumber);
    setSearchNumber(inputNumber);
    setIsClicked(true);
  };
  
useEffect(()=>{
  const fetchPokemon = async()=>{
    //APIにリクエストを送信
    const response= await fetch(`https://pokeapi.co/api/v2/pokemon/${searchNumber}`);
    const data= await response.json();
    setData(data);
  };
  fetchPokemon();
},[searchNumber]);

if(!data){
  return (
  <div>そのポケモンは存在しません</div>
)
};
//データの値の設定
const height:number =data.height/10;
const weight:number=data.weight/10;
//pokemonのステータスの型設定
type StatsList={h:number,a:number,b:number,c:number,d:number,s:number};
const statsList:StatsList={
  h:data.stats.find((stat:any)=>stat.stat.name=="hp")?.base_stat ?? 0,
  a:data.stats.find((stat:any)=>stat.stat.name=="attack")?.base_stat ?? 0,
  b:data.stats.find((stat:any)=>stat.stat.name=="defense")?.base_stat ?? 0,
  c:data.stats.find((stat:any)=>stat.stat.name=="special-attack")?.base_stat ?? 0,
  d:data.stats.find((stat:any)=>stat.stat.name=="special-defense")?.base_stat ?? 0,
  s:data.stats.find((stat:any)=>stat.stat.name=="speed")?.base_stat ?? 0
};

const totalStats: number=Object.values(statsList).reduce((a,b)=>a+b,0);
const typeNames:string[]=data.types.map((item:any)=>item.type.name);
const typeNamesJa: string[] = typeNames.map((typeName) =>
  typeNamesList.find((type) => type.eng === typeName)?.ja|| ""
);
const status: DataPoint[] = [
  {
    subject: 'HP',
    A: statsList.h,
    fullMark: 200,
  },
  {
    subject: '攻撃',
    A: statsList.a,
    fullMark: 200,
  },
  {
    subject: '特攻',
    A: statsList.c,
    fullMark: 200,
  },
  {
    subject: 'すばやさ',
    A: statsList.s,
    fullMark: 200,
  },
  {
    subject: '特防',
    A: statsList.d,
    fullMark: 200,
  },
  {
    subject: '防御',
    A: statsList.b,
    fullMark: 200,
  },
];
const RadarChartComponent: React.FC = () => {
  return (
    // 親コンテナに合わせてサイズを調整するResponsiveContainerを使用
    <ResponsiveContainer width="100%" height={400}>
      {/* cx, cyは中心点の位置、outerRadiusはチャートのサイズを定義 */}
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={status}>
        {/* PolarGrid は6角形のグリッド線を描画 */}
        <PolarGrid />
        {/* PolarAngleAxis は6角形の頂点（軸）のラベルを描画 */}
        <PolarAngleAxis dataKey="subject" />
        {/* PolarRadiusAxis は中心からの距離（数値のスケール）を描画しない設定 (必要なら変更可) */}
        <PolarRadiusAxis angle={30} domain={[0, 200]} />
        
        {/* Radar は実際のデータ系列を描画 */}
        <Radar name="ステータス" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} strokeWidth={2} />
        
        {/* Tooltip と Legend を追加してインタラクティブに */}
        <Tooltip />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className= "text-center text-4xl font-bold">ポケモン図鑑</h1>
        <div>
          <ButtonGroupInput 
            value={inputNumber}
            onChange={setInputNumber}
            onSearch={NumberSearch}
          />
          {isClicked && <p>検索しました</p>}
        </div>
        <h1 className = "text-center">
          名前：{data.name}/タイプ：{typeNamesJa}
        </h1>
        <h1>
          高さ：{height}m/体重：{weight}kg
        </h1>
          <img
            src={data.sprites.other["official-artwork"].front_default}
            alt={data.name}
          />
        <h2>HP：{statsList.h}</h2>
        <h2>攻撃力：{statsList.a}</h2>
        <h2>特殊攻撃力：{statsList.c}</h2>
        <h2>防御力：{statsList.b}</h2>
        <h2>特殊防御力：{statsList.d}</h2>
        <h2>スピード：{statsList.s}</h2>

        <h1>ポケモンステータスチャート</h1>
        <h2>種族値：{totalStats}</h2>
        <RadarChartComponent/>
      </main>
    </div>
  );
}
