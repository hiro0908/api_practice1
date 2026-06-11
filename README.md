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


[^1]: プログラムを静的に解析し、バグや問題点を発見するツール
[^2]: [ルールの詳細](https://eslint.org/docs/latest/rules/)
