---
layout: post
title: tailwindcss の config ファイルを babel-plugin-preval で読み込む
category: programming
tags:
  - Node.js
  - tailwindcss
  - typescript
  - TIL
---

tailwindcss の tailwind.config.js をコードから参照したいとき、なにも考えなくていいなら `tailwindcss/resolveConfig` を使えば実現できる。

ただこのやり方だとビルド時にだけあればいいプラグインなどが依存関係に入ってきてしまい、成果物が肥大化してしまう。

そこで[公式ドキュメント](https://tailwindcss.com/docs/configuration#referencing-in-java-script)では [`babel-plugin-preval`](https://github.com/kentcdodds/babel-plugin-preval) 使うといいよ、って書いてあるけどじゃあ実際どう使うの、ということは書いてない。

こうやる。

場所はどこでもいいんだけど、 babel が解決できる場所に下記のような内容のファイルを作成する。今回は `./config/tailwindcss.js` とした。

```javascript
// @preval
// babel-plugin-prevalでコンパイル時に実行される
// see https://tailwindcss.com/docs/configuration#referencing-in-java-script
const resolveConfig = require('tailwindcss/resolveConfig')
const tailwindConfig = require('../tailwind.config')

const config = resolveConfig(tailwindConfig)

module.exports = {
  colors: config.theme.colors,
}
```

いくつか書き方があるけど、今回は `@preval` を使う。  
今回は colors だけ export しているけど、用途に応じて `config.theme` を export したり、いろいろできる。

babel-plugin-preval はトランスパイルなしで実行されるので、実行環境でそのまま動かせるコードを書く必要がある。  
また、最終的な成果物も同様である(っぽい)。`export default {...}` ではなく `module.exports = {...}` にしているのはそのため。


babel の設定に preval プラグインを追加したら、あとはコンパイルするだけ。 


コードからは

```javascript
import { colors } from '~/config/tailwindcss'
```

的に参照できる。


TypeScript の場合は好きに型定義したらいい

```typescript
declare module '~/config/tailwindcss' {
  // `~/tailwind.config.js` のtheme.colorsと対応
  interface TailwindColors {
    // 色定義

    [key: string]: string | Record<string, string>
  }
  export const colors: TailwindColors
}
```
