---
layout: post
title: ブログを VitePress で書き直した
---

ふと思い立って Jekyll から VitePress に移行してみた。

今までは [Type on Strap](https://github.com/sylhare/Type-on-Strap) というテーマをちょっとカスタマイズしつつ使っていた。

ただ定期的に同期するのとか、記事内にちょっと凝ったウィジェットを埋め込むのがメンドかったので、ずっと自分で１からつくりたいなーと考えてはいた(ただ作る方のめんどくささが勝っていた)。

で、最近 VitePress の RC.1 がリリースされたツイートが流れてきたのでついにやる気になった、という流れ。

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">And here it is. VitePress RC.1 is out 🚀🚀🚀<br><br>So many people have worked so hard for this wonderful product! Now it&#39;s re-branded to match the Vite Brand. Hope you like it!<br><br>Docs: <a href="https://t.co/jWmNtVckau">https://t.co/jWmNtVckau</a><br>Changelog: <a href="https://t.co/RQyC0wOhAj">https://t.co/RQyC0wOhAj</a> <a href="https://t.co/mV1vrt9BYm">pic.twitter.com/mV1vrt9BYm</a></p>&mdash; Kia King Ishii (@KiaKing85) <a href="https://twitter.com/KiaKing85/status/1688869807733772288?ref_src=twsrc%5Etfw">August 8, 2023</a></blockquote>


## 要件

- デザインも自分でつくる
  - レスポンシブ
  - ダークモード
  - トップページ
  - 記事一覧
  - タグ一覧
- 既存の Jekyll サイトとパスをあわせる
  - 既存のいろいろなところにあるリンクが壊れない
- Markdown 内にウィジェット埋め込めるようにする
  - Kindle の商品詳細とかいい感じに
- GA4
- Twitterウィジェットの自動展開
- RSSフィード


## デザイン

tailwindcss でいい感じにしてやった。

ダークモードもトグルを用意しようと思わなければ素直に書けるのでよかった。

Markdown のスタイルは、 [`@tailwindcss/typography`](https://tailwindcss.com/docs/typography-plugin) がめちゃくちゃ捗った。記事面はほぼこれを適用しているだけ。

## パスを Jekyll と合わせる

これは VitePress の設定にある `rewrites` で何とかする感じ。

```ts
// .vitepress/config.ts
rewrites: {
  'posts/:skipped/:year-:month-:day-:slug.md': ':year/:month/:day/:slug/index.md',
},
```

これを使うと、「出力されるページパスはいい感じに変換される」。  
ただし、Markdown 内のリンクは予め変換後のパスで記入する必要があり。

また、記事一覧ページを自作する場合は、そちらのリンクも自分でいい感じに変換する必要がある。ここはちょいめんどい。

このブログの場合は

- トップページの最近の記事一覧
- 全記事一覧
- タグ一覧

で「いい感じの変換」をする必要があったんだけど、 [`createContentLoader`](https://vitepress.dev/guide/data-loading) のおかげで実装自体はそこまで大変ではなかった。

## Markdown 内にウィジェットを埋め込む

これは VitePress の機能として、[Vue コンポーネントの埋め込みがサポートされている](https://vitepress.dev/guide/using-vue)。

なので特に悩む必要もなくシュッと実装できた。  

Kindle の商品情報を取得するの、最初は Amazon の Product Advertising API を使おうかと思ったんだけど、どうやらこれは定期的な売上実績がないと使えないらしく今回は採用できなかった。  
仕方ないので Amazon の商品詳細ページから必要な情報を JSON 形式で取得するブックマークレットを作って解決。

## GA4

これは `config.ts` の `head` にスクリプトを追加

```ts
head: [
  [
    'script',
    {
      async: '',
      src: 'https://www.googletagmanager.com/gtag/js?id=G-XZRK8ZP8XC',
    },
  ],
  [
    'script',
    { id: 'init-gtm' },
    `window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XZRK8ZP8XC');`,
  ],
]
```

## Twitterウィジェット

これも GA4 と同じ

```ts
head: [
  // https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
  [
    'script',
    { id: 'register-twitter-widget' },
    `window.twttr = (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function(f) {
        t._e.push(f);
      };

      return t;
    })(document, 'script', 'twitter-wjs');`,
  ],
]
```

## RSSフィード

`config.ts` の `buildEnd()` フックを使うことによって、VitePress の `createContentLoader` API を使って生成することができた。

フィードの生成自体は [`jpmonette/feed](https://github.com/jpmonette/feed) を使うことで実現できる(どうでもいいけど jpmonette 氏は私の出した PR に反応してほしい…)。

---

そんなこんなで、実働2日くらいで移行できた。  

デザインもシンプルで小綺麗な感じになって満足している。

全部作りなおしたので、また AdSense 審査出してみようかな(ドメイン変えたタイミングで審査落ちてしまったが、Jekyll テーマの修正がしんどくて放置していた)
