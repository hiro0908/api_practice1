# ポケモン図鑑アプリ 
## ディレクトリー構成
|層|ディレクトリー|役割|
|---|---|---|
|Presentation層|@/app|リクエストの送信と受け取り、UIの表示|
|Application層|@/src/application|実際の機能|
|Domain層|@/src/domain|	不変の事実 |
|Infrastructure層|@/src/infrastructure|外部API・DB等との実際のやり取り|


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
pnpm tsx src/script/fetchPokemon.ts
```

実行すると以下の処理が行われる。

* Pokemonテーブルのデータ削除
* Statsテーブルのデータ削除
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
http://localhost:3000/api/pokemon
```

### ポケモン詳細取得

```text
http://localhost:3000/api/pokemon/1
```

例：フシギダネ

```text
http://localhost:3000/api/pokemon/1
```

## 10. 画面機能

* ポケモン一覧表示
* ポケモン検索
* ポケモン画像表示
* タイプ表示
* 高さ・体重表示
* 種族値表示
* レーダーチャート表示
* PostgreSQLからデータ取得
* Next.js API Route経由でフロントエンドへデータ提供
