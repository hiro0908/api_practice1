"use client";
import { stat } from "fs";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

//図鑑番号サンプル
const dexNumber:string ="40";
//APIにリクエストを送信
const response= await fetch(`https://pokeapi.co/api/v2/pokemon/${dexNumber}`);
const data= await response.json();
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
const typeNamesJa: string[] = typeNames.map((typeName) =>
  typeNamesList.find((type) => type.eng === typeName)?.ja|| ""
);

const isShiny:boolean=false;
const imageType:string="正面"
const imageTypeList:{type: string, url: string}[]=[
  {type:"公式イラスト",url:"/other/official-artwoek"},
  {type:"正面",url:""},
  {type:"側面",url:"/other/home"},
  {type:"ポケモンホーム",url:"\other/home"}
]
const imageTypeUrl=imageTypeList.find((item)=>item.type==imageType)?.url;
const shiny:string=isShiny?"/shiny":"";
// const url:string=`https://raw.githubusercontent.com/PokeAPI/sporetes/master/sprotes/master/pokemon${imageTypeUrl}${shiny}/${dexNumber}.png`

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


interface DataPoint {
  subject: string; // 軸のラベル
  A: number;       // 1つ目のデータセットの値      // 2つ目のデータセットの値 (必要に応じて削除・変更可能)
  fullMark: number; // その項目の最大値（スケール調整用）
}
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

export default function Home() {
  console.log(data)
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1>
          名前:{data.name}/タイプ：{typeNamesJa}
        </h1>
          <img
            src={data.sprites.other["official-artwork"].front_default}
            alt={data.name}
          />
        <li>HP:{statsList.h}</li>
        <li>攻撃:{statsList.a}</li>
        <li>特殊攻撃:{statsList.c}</li>
        <li>防御力:{statsList.b}</li>
        <li>特殊防御力:{statsList.d}</li>
        <li>スピード:{statsList.s}</li>
        {/* <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            検索
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            クリア
          </a>
        </div> */}
        <h1>ポケモンステータスチャート</h1>
        <RadarChartComponent/>
      </main>
    </div>
  );
}
