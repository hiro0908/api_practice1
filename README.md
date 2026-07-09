# ポケモン図鑑アプリ 
## このアプリの作成目的
APIの仕組みを理解しdoker上にPostgreSQLを建て、APIからの情報を取得したデータベースにアクセスし動かせるようにする

## 画面遷移
### ホーム画面
![alt text](images/Readme1.png)
### 検索後の遷移画面
![alt text](images/Readme2.png)

## 色違いへの画像遷移
### 遷移前
![alt text](images/Readme3.png)
### 遷移後
![alt text](images/Readme4.png)

## 詳細除法の取得
![alt text](images/Readme5.png)

## ディレクトリー構成
レイヤードアーキテクチャの構成を採用し4層構造になっている
|層|ディレクトリー|役割|
|---|---|---|
|Presentation層|@/src/app|ルーティング、APIエンドポイント、画面の表示|
|Application層|@/src/components/ui|画面を構成するUI部品（ヘッダー、カード、チャート等）|
|Domain層|@/src/domain/pokemon|型定義、タイプ相性計算などの不変のルール|
|Infrastructure層|@/src/infrastructure|PokeAPI・PostgreSQL(Prisma)との実際のやり取り|

```text
src/
├─ app/                          # Presentation層
│  ├─ api/pokemon/
│  │  ├─ route.ts                # ポケモン一覧取得API
│  │  └─ [id]/route.ts           # ポケモン詳細取得API
│  ├─ pokemon/[id]/page.tsx      # ポケモン詳細ページ
│  ├─ page.tsx                   # ポケモン一覧ページ
│  ├─ layout.tsx
│  └─ globals.css
├─ components/ui/                # Application層
│  ├─ PageHeader.tsx / PageTitle.tsx / PokedexIntro.tsx
│  ├─ TypeBadge.tsx / TypeEffectivenessSection.tsx
│  ├─ BaseStatBarChart.tsx / RaderChartComponent.tsx
│  ├─ ButtonGroupInput.tsx / button.tsx / input.tsx など（shadcn由来のUI部品）
│  └─ fetchPokemonStatus.ts
├─ domain/pokemon/                # Domain層
│  ├─ pokemon.ts                  # ポケモン関連の型定義
│  ├─ pokemonTypeStyle.ts         # タイプごとの色・アイコン定義
│  ├─ pokemonTypeDictionary.ts / typeChart.ts
│  └─ calculateEffectiveType.ts   # タイプ相性の計算ロジック
├─ infrastructure/                # Infrastructure層
│  ├─ api/pokemonApi.ts           # PokeAPI呼び出し
│  └─ db/                         # DB登録処理（Prisma経由）
│     ├─ dbFunction.ts
│     ├─ fetchPokemon.ts
│     └─ prisma.ts
└─ lib/utils.ts

prisma/
├─ schema.prisma
└─ migrations/
```

## 工夫した点
- 画面遷移後のポケモンの詳細ページでステータスや相性、特性など情報量を増やすことによって隙間を減らした点。
- ボタンを押すことでポケモンの色違いを表示する機能を持たせユーザー体験を向上させる
- Next.jsのApp Route機能を使いURLから特定の情報に瞬時にアクセスできるようにした点
- 画面遷移時にロードしているのかを明示しつつテーマ性を持たせるためにモンスターボールの図形を回転させて表示した点
- 画面遷移後のポケモンの詳細画面にて特性にドロワー機能を追加し画面遷移することなく必要な情報を取得できるようにした

## 苦労した点
- ポケモン情報を1匹ごとに取得した際にfor文のインデックス番号を割り当てると特殊個体のIDに対応しておらずエラーが出てしまうという点。
- 設計思想の選定
- Prisma ORMの導入
- APIのどの部分に欲しい情報があるのかを探す
- 機能をComponents化したときにどの程度細分化すればいいのかという点
- 特殊個体と通常個体の関連付け
- データベースの設計
- APIから必要な情報を持ってくること


## 今後の展望
- geminiを使用して読み取った画像をもとにどのポケモンなのかを類推させそのポケモンを表示するような機能を作成したい
- 読み取った画像とマッチしたポケモンにマークを付けて一種のゲーム性やコレクター性を持たせたい
- 今日のポケモンはこれというおみくじのような機能
- 画像を読み込みすぎてGitHubレート制限に引っかかってしまっているので修正する必要がある

## 学んだこと
- `pnpm`や`npm`などのパッケージマネージャーの特性や役割の違いについて
- `Prettier`や`ESLint`などのコード整形ツールについて
- `SPA`と`SSR`のちがいについて
- アプリケーション層のアーキテクチャにおけるそれぞれのアーキテクチャの違いについて
- Prisma ORMによるDB操作
- リーダブルコードによるコードの書き方の心得
- dockerを用いたデータベースの運用
- APIの情報をデータベースに登録しそれを利用する方法
- Next.jsの機能であるApp Routerを利用したページのルティング
- 今実装する必要があるのかそうではないのかを剪定して順序付けする基準
- 非同期処理について
- きちんとしたリレーショナルデータベースを設計するうえでの難しさ

質問リスト
- これから勉強しておいた方がよいもの
- UIの設計やデザイン系で何かためになるものはあるのか




# 実行手順
## 1. リポジトリを取得

```bash
git clone <リポジトリURL>
cd ts_poke
```

## 2. パッケージのインストール

```bash
pnpm install
```

## 3. 環境変数の設定

プロジェクト直下に `.env.local` ファイルを作成し、PostgreSQL の接続情報を設定する。

例：

```env.local
DATABASE_URL="postgresql://ユーザー名:パスワード@localhost:5432/データベース名"
```

## 4. DockerでPostgreSQLコンテナの起動

docker compose up -d



## 5. Prisma のマイグレーション実行

```bash
pnpm prisma migrate dev --name ["作成したいファイル名"]
```

## 6. Prisma Client の生成

```bash
pnpm prisma generate
```

## 7. ポケモンデータの取得とDB登録

PokeAPIからポケモン情報を取得し、PostgreSQLへ保存する。

```bash
pnpm tsx src/infrastructure/db/fetchPokemon.ts
```

実行すると以下の処理が行われる。

* Pokemonテーブルのデータ削除
* Statsテーブルのデータ削除
* Abilityテーブルのデータ削除
* IDのリセット
* PokeAPIからポケモン情報取得
* PostgreSQLへ保存

データベースの確認
```bash
pnpm prisma studio
```

## 8. 開発サーバ起動

```bash
pnpm dev
```

ブラウザで以下へアクセスする。

```text
http://localhost:3000
```

## 9. API確認

### ポケモン一覧取得

```text
http://localhost:3000
```

### ポケモン詳細取得

例：フシギダネ

```text
http://localhost:3000/pokemon/1
```

## 10. 画面機能

* ポケモン一覧表示
* ポケモン検索（図鑑番号を入力して詳細ページへ遷移）
* ポケモン画像表示
* 色違い画像の表示切り替え
* タイプ表示
* 高さ・体重表示
* 特性表示（通常特性・隠れ特性）
* 説明文（フレーバーテキスト）表示
* 種族値表示
* レーダーチャート表示
* タイプ相性表示（弱点・耐性・無効）
* ポケモン図鑑起動時の演出表示
* ローディング中のモンスターボールアニメーション表示
* ヘッダー固定表示
* PostgreSQLからデータ取得
* Next.js API Route経由でフロントエンドへデータ提供
