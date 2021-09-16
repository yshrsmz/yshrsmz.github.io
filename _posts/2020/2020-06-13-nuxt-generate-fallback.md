---
layout: post
title: Nuxt.jsでgenerateした時のfallbackオプションについて
category: programming
tags:
  - vue.js
  - nuxt.js
  - til
---

[https://ja.nuxtjs.org/api/configuration-generate/#fallback](https://ja.nuxtjs.org/api/configuration-generate/#fallback)

`generate.fallback=true` にすると `404.html` が生成される。
これ、動的にルーティングしたいページへのリクエストが来たときに、「URLはそのままで`404.html`を提供する」という使い方をするものだった。
最初この使い方がよくわかってなくて、単純に存在しないページへのリクエストがあったときに単純にリダイレクトしてたけど、そういうことじゃなかった。

`404.html` ということで単純なエラーページぽく見えていたけど、実際はこのhtml上でURLに基づいてルーティングをしてくれる。
そこで解決できたらそのままページを表示するし見つからなければ`/components/layout/error.vue`で書いたエラーページに遷移するし、という挙動。

わかってしまえばそりゃそうだ、という話でした。
