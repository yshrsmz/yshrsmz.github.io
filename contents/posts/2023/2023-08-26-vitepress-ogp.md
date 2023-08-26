---
layout: post
title: ブログ各記事の OG 画像を作った
tags:
  - Vue.js
  - VitePress
---

ブログ作り直したので、ついでに OG 画像もタイトル入ったやつをちゃんと作ろうと思い立った。


**目次**
[[toc]]

## 手段

OG 画像の作り方にはいくつか種類がある。

### Canvas API

たとえば Canvas API。JavaScript で画像つくる、といったら Canvas API なので一番に思いついたのはこれだけど、JavaScript の Canvas API はテキストの折返しをサポートしていない。文字幅計算しつつ自前で折り返すこともできなくはないけど、横文字と日本語で折返しの規則違うし、その辺を真面目にやろうと思うと明らかにめんどくさすぎる。

というわけで今回 Canvas の利用は見送ることにする。

どこかで採用することになったら、[Automattic/node-canvas](https://github.com/Automattic/node-canvas) よりは [Brooooooklyn/canvas](https://github.com/Brooooooklyn/canvas) がいいかもしれない。前者はビルドに色々ツールのインストールが必要だけど、後者はスタンドアロンで動かすことができる。

### HTML から生成できないか。

で、次に考えたのが HTML から PNG 画像にできないか、ということ。  
HTML であればテキストの折返しも自動でできるし、スタイルもある程度直感的にあてられる。

どうやら HTML -> Canvas -> SVG -> PNG という順序ならできるらしい。

探してみたら、Vercel が提供する [`@vercel/og`](https://www.npmjs.com/package/@vercel/og) というそのものズバリなパッケージが存在した。ただこれは Vercel 環境上で動かすことを想定しているのでそのままでは使えなさそう。加えて、どうやらクローズドソースらしい。

ただ、NPM 上の README を見てると、参考にしているライブラリのクレジットがあった。

> Acknowledgements  
> This project will not be possible without the following projects:
>
> Satori  
> Twemoji  
> Google Fonts and Noto Sans  
> Resvg and Resvg.js  

というわけでこれらを参考にしたら、 OG 画像が生成できそう。

結論から言うと、 [vercel/satori](https://github.com/vercel/satori) と [yisibl/resvg-js](https://github.com/yisibl/resvg-js) で実現できた。

## 実装

こんな画像ができた

![OG画像サンプル](/assets/img/posts/2023/08/26/ogp_sample.png)

手順としては、

1. Satori で HTML から SVG を生成する
2. 1 の SVG を、 Resvg.js で png にする
3. fs で成果物を書き出す

となる。

#### Satori

Satori は HTML を SVG に変換してくれるわけだけど、 `ReactNode` で渡すことしかできない。これは Vercel が Next.js の開発元であること、 Satori が内部で [Yoga](https://yogalayout.com/) という、ReactNative と同じレイアウトシステムを使っていることを鑑みればさもありなん、という感じ。

とはいえ、だから JSX で書く必要がある、というわけではない。  
Satori の README にも [JSX 無しでつかうことに言及したセクション](https://github.com/vercel/satori#use-without-jsx)があり、下記のようにある

```ts
await satori(
  {
    type: 'div',
    props: {
      children: 'hello, world',
      style: { color: 'black' },
    },
  },
  options
)
```

今回は下記のような HTML(+CSS) なので、これをいい感じに上記記法に変換する。

```html
<div style="display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%; background-color: white; font-size: 48px;">
  <div style="display: flex; flex-direction: column; align-items: center; height: 100%; padding: 20px 56px;">
    <p style="display: flex; align-items: center; flex-grow: 1; font-weight: 700;">ブログ各記事の OG 画像を作った</p>
    <p style="font-size: 42px; font-weight: 400;">August 26, 2023</p>
    <p style="font-size: 48px; font-weight: 700;">codingfeline.com</p>
  </div>
</div>
```

```ts
const svg = await satori(
  { ... }, // ↑ の HTML を ReactNode の記法に変換したもの
  {
    width: 1200,
    height: 630,
    fonts: [...] // 利用するフォントの設定
  },
)
```

あとは Resvg.js で PNG に変換、実ファイルに書き出すだけ

```ts
const resvg = new Resvg(svg)
const pngData = resvg.render()
const pngBuffer = pngData.asPng()

await fs.writeFile(OUTPUT_PATH, pngBuffer)
```

## どのタイミングで出力するか

1. `.vitepress/config.ts` の `transformPageData` で各記事の frontmatter に OG 情報を追加し
2. `.vitepress/config.ts` の `buildEnd` でまとめて各記事の OG 画像を生成する
  - `transformPageData` はまだ記事 HTML が生成される前なので、この段階で画像生成しても HTML 生成時に消されてしまう
