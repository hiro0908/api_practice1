# 概要
今まで何気なく言われるがままに使っていたツールや人に言われた事柄について大まかに調べたメモである。整合性はよくわからないが今後見返すときに何かあれば便利だと思い、文字に起こした。
# Lintについて調べてみた
## ESLintとは？
ESLintは、JavaScriptやTypeScriptのコードがコーディング規約に準拠しているかをチェックするツールである。一般的にはリンター[^1]というジャンルのツールである。類似した機能を持つコンパイラーとの大きな違いはそれぞれの機能の本質にある。コンパイラーはある言語から別の言語に変換することであるのに対してリンターはプログラムの問題点を指摘することであり、言語から言語への変換は行わない。そのため相互補完的な関係を作ることが可能である。
##導入方法
Typescriptがはいいている状態で下記のコマンド実行していく。
<br>`pnpm init -y @eslint/config@latest`
## ESLintのルール設定
ESLintには「ルール(rule)」という概念があり、ルール[^2]はチェックの最小単位である。ルール設定が完了したら下記のコードを実行することでルールに則った問題点を指摘する。
<br>`npx eslint`
ルールには`off` `warn` `error`の3種類で重要度が設定でき、重要度は以下の表のようになっている。ルール設定ファイルのrulesのフィールドにルール名:重大度で設定する。
|重要度|数値|効果|
|----|----|----|
|off|0|error|
|warn|1|警告するが終了コードに影響しない|
|error|2|警告し、終了コードを1にする|

## ESLintの自働化の導入
ESLineのルール[^3]の中にプラグインをインストールすることで自動修正できるものがある。
<br>`npm install -D @stylistic/eslint-plugin`
プラグインをインストールしたら`eslint.congig.ts`を開いて以下の二行を追加すれば完了。<br>
`import tseslint from "typescript-eslint"`<br>
`tseslint.configs.recommended,`<br>
逆にどうしてもルールを破りたい場合は破りたいコマンドの前文に以下のコードを付け加えることによって無視させることが出来る<br>
`// eslint-disable-next-line camelcase`

# npmについて
## npmとは？
Node package managerの略称でJavaScriptのパッケージ管理ツールです。ライブラリのインストールや更新、スクリプトの実行を簡単に行うことができる。

## npmの必須コマンドとエイリアス
`npm install`<br>
`npm uninstall`<br>
`npm init`<br>
`npm update`<br>
`npm restart`<br>
`npm start`<br>
`npm stop`<br>
`npm version`<br>
`npm publish`<br>

## npmパッケージとは？
他の開発者が作成したnpmディレクトリに公開されているビルド済みのプロジェクト[^3]をそのまま利用できる仕組み<br>
最新バージョンをインストールするには以下のコマンドで実行できる。
<br>`npm install npm@latest -g`<br>

## package.jsonファイルについて
package.jsonファイルを使うことでプロジェクトにインストールされているすべてのパッケージを効率よく管理することが出来る。加えて、`npm install`の参照場所にもなるため大変便利である<br>
package.jsonファイルの作成には以下のコマンドを実行する。
<br>`npm init`<br>

## npmの依存関係
node_modulesフォルダに作成される他のフォルダは、インストールしたパッケージが機能するために依存するその他のパッケージである。インストールしたパッケージのpackage.jsonファイルを見れば依存関係を簡単に確認できる。

## npm-scriptsとは
特定のタスクを自動化するためにpackage.jsonファイルで定義する一種のカスタムスクリプトである。独自のスクリプトを定義することでCSSコードの圧縮、変更に際してのサーバーの再起動、本番用のプロジェクトのビルドなど、様々なタスクを自動化することができる。以下のコマンドで実行できる。
<br>`npm run [script-name]`<br>

# yarnについて
## yarnとは？
javascriptのパッケージマネージャーでありnpmと同じpackage.jsonが使えるため互換性がある。

## yarnのメリット
- npmよりもインストールが早い
- npmよりも厳密にモジュールのバージョン固定ができる
- npmと一緒に使える

## yarnの実装とpackage.jsonの生成
- `sudo npm install -g yarn`
- `yarn init`

## yarnの使用
- package.jsonに記されたモジュールをインストール`yarn`
- パッケージの追加 `yarn add [パッケージ名]`
- パッケージのアンインストール `yarn remove`
- devDependencies[^5] `yarn add [パッケージ名] --dev`
- yarn global add [パッケージ名]

# pnpmについて
## pnpmとは？
Performant NPM を略したJavaScript のパッケージ管理ツールである。npm や yarn と似ていますが、主にディスク容量の節約とインストール速度の向上、node_modules の厳格さに焦点を当てている。

## npmとの違い
ストレージの使い方に大きな違いがある。
- npm
同じ依存関係を使う複数のプロジェクトの場合、それぞれにコピーを保存します
- pnpm 
依存関係を一箇所に集約し、必要になったら依存関係へアクセスするためのリンクを生成する。元の依存関係を複製しないためストレージの節約につながる。

## インストールが高速
従来のjavascriptのインストール方法
![](https://static.zenn.studio/user-upload/ff38a02c608c-20260618.png)
pnpmのインストール方法
![](https://static.zenn.studio/user-upload/6b9698ef3e2e-20260618.png)
上記のようにパッケージごとに個別にステージを実行することで、待ち状態を生み出さないようにし、インストールのプロセスを効率化しています。
## 使用方法
- 自分のインストール
`npm install -g pnpm`
- バージョン管理
<br>`corepack enable`<br>
　　　　　　　↓
<br>`corepack prepare pnpm@latest --activate`<br>

- プロジェクトの作成・依存の追加
`pnpm init`+`pnpm add [プロジェクト名]`
- スクリプトの実行
`pnpm run dev`
- よく使うコマンド
|操作|コマンド|
|---|---|
|依存のインストール|`pnpm install`|
|パッケージ追加|`pnpm add パッケージ名`|
|開発用パッケージ|`pnpm add -D パッケージ名`|
|パッケージ削除|`pnpm remove パッケージ名`|
|全削除(初期化)|`pnpm install --force`|

## 応用
- pnpm workspace
複数プロジェクトをまとめて管理・ビルド・依存共有できる
- pnpm hooksによる自動化
pnpmにはインストール時に自動処理できるhooks機能がある。
<br>例:パッケージインストール直後に特定のスクリプトを走らせるなどが可能

# npxについて
## npxとは？
ローカルにインストールされたパッケージを検索し、実行可能ファイル[^4]を見つけて実行できる。そのためパッケージの汚染を気にしないで実行できる。
## 使用場面
- 一度だけ使う時
- GitHubのgistやリポジトリを直接実行したい時
- 動作の検証(異なるpackageバージョンのテスト)

## npm/yarn/pnpmのイメージ
- npm
元祖的な存在。Node.js に付いてくる標準的なやつ
- yarn
Facebook（現 Meta）が「npmをもっと速く・便利にしたい」と作った子
- pnpm 
「ディスクの無駄コピーを減らしたい」「依存関係をもっと厳密にしたい」という発想で作られた

# Prettierについて
## prettierとは？
コードフォーマッターの一種で、コードを自動的に整形してくれるツール。共通のコーディングスタイルを定義することによって統一の手間を省くため、チーム開発で活躍できる。
## できること
- コードの整形
- 最適な折り返し
- インデントの自動調整
- セミコロンの自動挿入
- シングルクォートとダブルクォートの統一

# SPAとSSRについて
## SPAとは？
SPAとはSingle Page Applicationの略称で、ブラウザから初回のリクエストが来るとまず1つのページをサーバーが生成してブラウザが返却する。そこから新たに取得したいデータが存在すればその差分を都度APIからデータを取得してDOMを構築しHTML要素がレンダリングされる。
![](https://static.zenn.studio/user-upload/bffdbea04d13-20260618.png)
## SPAに対応する技術
- React
- Angular
- Vue.js
## SPAのメリット
1. ページごとにいクエストを送らないため、ページの遷移が高速<br>
    →初回読み込み時のみHTTPサーバーとの通信を行い、差分をAPIから取得するため
2. ユーザーに優れたUXの提供が可能

## SPAのデメリット
1. 初回アクセスに時間がかかる<br>
    →初回アクセス時にはサーバー側にリクエストを送り、全ページの描画に必要なjavascriptファイルを取得してくるため
2. SEO問題<br>
    SPAの各ページにアクセスした際に、レスポンスとして帰ってくるHTMLは常にindex.htmlであり、アクセスしたページによって差はない。そのため、GoogleクローラーがWebサイトの中身を認識してくれない可能性がある。

## SSRとは？
Server Side Renderingの略称でページ遷移のたびにサーバーにHTTPリクエストが走り、サーバー側でAPIと連携され生成されたHTMLをブラウザに返すアーキテクチャーのことを指す。SSRでは初回レンダリング速度改善とSEOに対する強みを持つことで、先に述べたSPAのデメリットを解消することができる。
![](https://static.zenn.studio/user-upload/6040c616b880-20260618.png)
## SSRに対応する技術
- Next.js
- Nuxt.js
## SSRのメリット
1. 安定した表示速度を保つことが可能<br>
    SPAでは初回ローディングコストが発生していたがレンダリングをサーバー側で行えるため、ブラウザ側の負担が減り初回読み込み時に時間がかかることがない。

2. SEO問題の解消<br>
    Next.jsを例に挙げるとSSR及びSSGはPre-rendering機能[^6]を有していて、そのHTMLがブラウザに表示されると、Javascriptが読み込まれ、Reactコンポーネントが有効になるが、その際にaタグをラップするlinkタグが含まれてるため、このaタグによって、Googleクローラーはリンクをたどることが出来る。

# まとめ
今まで使っていたツールには様々な目的があって発展してきたということに調べて気が付いた。何気なく始めたことだが、機械があればまた認知の齟齬をなくすために行っていきたいと思う。

# 参考資料
1. Zenn「JavaScriptパッケージ管理ツール「pnpm」の紹介」
   url:https://zenn.dev/cloud_ace_jp/articles/articlejs-package-manager-pnpm
2. Qiita「【図解】SPA、SSR、SSGの違いについて」
   url:https://qiita.com/manabito76/items/fe91eefe11a74dcf5126
など




[^1]: プログラムを静的に解析し、バグや問題点を発見するツール
[^2]: [ルールの詳細](https://eslint.org/docs/latest/rules/)
[^3]: [パッケージ一覧](https://www.npmjs.com/)
[^4]: node_modules/pacakge名/bin配下にあるファイル
[^5]: 開発時やテスト時のみに必要で、本番環境には不要なパッケージ 
[^6]: 事前に生成されたHTMLが返される機能
