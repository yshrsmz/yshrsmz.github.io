---
layout: post
title: ブログを tailwindcss v4 に移行
category: diary
tags:
  - VitePress
  - tailwindcss
---

掲題の通り。

**目次**
[[toc]]

何気に 2026 年初エントリだ。

## tailwindcss v4 が出た

公式のリリース記事は[こちら](https://tailwindcss.com/blog/tailwindcss-v4)。

基本的に[公式のアップグレードガイド](https://tailwindcss.com/docs/upgrade-guide)に沿って更新していく。


## @tailwindcss/upgrade はモノレポで使えないぽい？

公式の推奨は、公開されている `@tailwindcss/upgrade` パッケージを使ってアップグレードすること。

```shell
pnpm dlx @tailwindcss/upgrade
```

的に。

しかし VitePress のディレクトリ構成が特殊だからなのか、うまいこと動いてくれず、下記のようなエラーが出てしまった。

```shell
% pnpm dlx @tailwindcss/upgrade@next
≈ tailwindcss v4.0.2

│ Searching for CSS files in the current directory and its subdirectories… 
│ ↳ Could not determine configuration file for: `./node_modules/tailwindcss/base.css` 
│   Update your stylesheet to use `@config` to specify the correct configuration file explicitly and then run the upgrade tool again. 
│ ↳ Could not determine configuration file for: `./node_modules/tailwindcss/components.css` 
│   Update your stylesheet to use `@config` to specify the correct configuration file explicitly and then run the upgrade tool again. 
│ ↳ Could not determine configuration file for: `./node_modules/tailwindcss/screens.css` 
│   Update your stylesheet to use `@config` to specify the correct configuration file explicitly and then run the upgrade tool again. 
│ ↳ Could not determine configuration file for: `./node_modules/tailwindcss/tailwind.css` 
│   Update your stylesheet to use `@config` to specify the correct configuration file explicitly and then run the upgrade tool again. 
│ ↳ Could not determine configuration file for: `./node_modules/tailwindcss/utilities.css` 
│   Update your stylesheet to use `@config` to specify the correct configuration file explicitly and then run the upgrade tool again. 
│ ↳ Could not determine configuration file for: `./node_modules/tailwindcss/variants.css` 
│   Update your stylesheet to use `@config` to specify the correct configuration file explicitly and then run the upgrade tool again. 
```

また、レポジトリルートで実行したときは下記のエラーが発生してしまった。まあこれは残当。

```shell
% pnpm dlx @tailwindcss/upgrade@next
≈ tailwindcss v4.0.2

│ Searching for CSS files in the current directory and its subdirectories… 
│ ↳ Cannot find any CSS files that reference Tailwind CSS. 
│   Before your project can be upgraded you need to create a CSS file that imports Tailwind CSS or uses `@tailwind`. 
│ ↳ No PostCSS config found, skipping migration. 
│ Updating dependencies… 
│ No changes were made to your repository. 
```

仕方ないので、アップグレードガイドにある内容を一つずつ実行していくことにする。


## @tailwindcss/vite いれる

v4 は vite を直接サポートするようになったので、postcss 経由で使う必要がなくなった。ただ、なにか postcss のプラグインが他に必要なのであれば、その限りではない(かもしれない。未検証)。

VitePress の場合は、 `.vitepress/config.ts` で設定する。


```ts
import { defineConfig } from 'vitepress'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
```

ちなみに `@tailwindcss/vite` は現状引数での設定変更をサポートしていない。

また、私の環境では最初 `@tailwindcss/vite` の型解決に失敗してしまい、 `tsconfig.json` の `moduleResolution` を `node` から `bundler` に変える必要があった。

`.vitepress/config.ts` で公式プラグインを設定することにより `postcss.config.js` は不要になるので削除してしまう。

## tailwind.config.js の削除

v4 では CSS-first configuration になり、`tailwind.config.js` が不要になった。

そのため、設定項目は `@import "tailwindcss";` を書いた css ファイルに書いていくことになる。

たとえば色定義を追加している場合は


```css
@import "tailwindcss";

@theme {
  --color-amazon: #f6ce50;
}
```

となる。

### @tailwindcss/typography

`tailwind.config.js` にてプラグインを追加していた場合は、プラグインが v4 に対応しているか否かによって対応が異なる模様。

弊ブログで使っている `@tailwindcss/typography` は、2026/02/02 時点ではまだ v4 に対応していないので、下記のように [`@plugin` directive](https://tailwindcss.com/docs/functions-and-directives#plugin-directive) を使って書くことになる。


```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

しかしこの方法では、`tailwind.config.js` でプラグインの挙動をいじっていた場合はうまく移行しきれない可能性がある。

`@tailwindcss/typography` の v4 対応については、こちらの issue を追えばよさそう。

- [docs: update for Tailwind 4 · Issue #372 · tailwindlabs/tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography/issues/372)


#### prose-a のスタイルのあたり方がおかしい件

[`@tailwindcss/typography` の公式サンプル](https://github.com/tailwindlabs/tailwindcss-typography/blob/main/README.md#element-modifiers)を参考に下記のように書いていたところ、 `prose` クラスをあてた要素にホバーしたタイミングで、全 `a` 要素のスタイルがホバーしたときのものに切り替わるようになってしまった。

「`a` 要素にホバーしたタイミングで、ホバーされた `a` 要素のスタイルのみ切り替わる」が想定する挙動であり、v3 での挙動でもあった。

```html
<Content class="VPPost__content vp-doc prose dark:prose-invert prose-a:break-all hover:prose-a:decoration-dotted mt-8 max-w-full flex-grow" />
```

しかしこれの解決は簡単で、解決策付きの issue がすでに起票されていた。

- [Pseudoclass styles apply at wrong level with tailwind v4 · Issue #376 · tailwindlabs/tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography/issues/376)

OP に記載があるように、

```
hover:prose-a:decoration-dotted
```

を

```
prose-a:hover:decoration-dotted
```

に変えてあげれば良い。

OP も言ってるけど、たしかにこれ修正後のほうが正しい気がしてしまう。


## Vue コンポーネントの修正

### リネームされた CSS クラスの修正

いくつかのクラスがリネームされたり非推奨になったりしている。

- [Upgrade guide - Getting started - Tailwind CSS](https://tailwindcss.com/docs/upgrade-guide#renamed-utilities)

この辺を見つつ書き換えれば良い。


### `@apply` が効かない

アップグレードガイドの [Using @apply with Vue, Svelte, or CSS modules](https://tailwindcss.com/docs/upgrade-guide#using-apply-with-vue-svelte-or-css-modules) と issue にある [Unable to use the @apply in vue scoped css. · Issue #15717 · tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss/issues/15717) が参考になる。

v4 では Vue コンポーネントに直接書かれた style とメインの CSS は個別にバンドルされる。
そのため theme の各種変数やユーティリティにアクセスできず、結果として `@apply` に失敗してしまう。

これを回避するためには [`@reference`](https://tailwindcss.com/docs/functions-and-directives#reference-directive) directive を使って、メインの CSS ファイルを参照する必要がある、ということらしい。


```vue
<template>
  <h1>Hello world!</h1>
</template>

<style>
  @reference "../../style.css";

  h1 {
    @apply text-2xl font-bold text-red-500;
  }
</style>
```

つまりこういうこと。いかにも煩雑だが、`@apply` しない場合は不要なようなので、影響があるのはサードパーティライブラリを使用するごく一部のコンポーネントに限られる気はする。
