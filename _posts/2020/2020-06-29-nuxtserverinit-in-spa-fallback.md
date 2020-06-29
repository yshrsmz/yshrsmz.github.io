---
layout: post
title: Nuxt.js静的サイトモードのfallbackのSPAモードとnuxtServerInit
category: programming
tags:
  - vue.js
  - nuxt.js
  - til
---

大前提として、`nuxtServerInit`というAction名のとおり、これはサーバサイドでしか実行されない。  
静的サイトモードだと、設定によるけど`generate`コマンドの実行時に呼ばれる。

そしてfallbackのSPAモード。これは動的に扱いたいroute用の機能だけど、このSPAモード用のhtml(200.htmlとか404.htmlとか)の生成時には`nuxtServerInit`は呼ばれない。

SPAモードでは`nuxtServerInit`呼ばれない、という仕様なんだから確かにそのとおり。なんだけどこれを完全に失念しててSPAモードで表示していた一部ページと、そこから遷移した各ページで一部データにアクセスできない、という状況が生まれてしまっていた。

解決する方法はいくつかあるけど、今回はSPAモードでも`nuxtServerInit`を呼ぶ方法を採用した。  
実装は簡単。

まずはStateに初期化済みかどうか判定できる値を用意する。`initialized: boolean`みたいな値を用意するのでもいいだろう。

次にpluginを追加する。単純に、Stateが初期化済みでなければ`nuxtServerInit`を実行する。  
`res`とか`req`とか`context`の一部の値はクライアント側ではアクセスできないので、そこは注意が必要。

```typescript
// ~/plugins/init.client.ts
import { Context } from '@nuxt/types'
import { RootState } from '~/store'

export default async function ({ app, store }: Context): Promise<void> {
  if (!(store.state as RootState).initialized) {
    await store.dispatch('nuxtServerInit', app.context)
  }
}
```

`nuxt.config.ts`のplugin設定はこんな感じに

```typescript
plugins: [
    ...,
    { src: '~/plugins/init.client.ts', mode: 'client' },
]
```

`mode: 'client'`が重要。`nuxtServerInit`はサーバサイドでは普通に呼ばれるので、SPAモード(=ブラウザ側)でのみ処理されればいい。

### 参考

- [Generate and dynamic route fallback if static file is not generated · Issue #7051 · nuxt/nuxt.js](https://github.com/nuxt/nuxt.js/issues/7051#issuecomment-604914461)
