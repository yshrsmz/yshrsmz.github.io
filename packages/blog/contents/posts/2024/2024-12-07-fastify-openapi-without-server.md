---
layout: post
title: Fastify のサーバをー起動せずに OpenAPI ドキュメントを出力する
category: diary
tags:
  - TIL
  - Fastify
  - Node.js
---


`@fastify/swagger` で OpenAPI ドキュメントを自動生成しているとき、サーバー起動せずに OpenAPI ドキュメントを出力しよう

**目次**
[[toc]]

## TL;DR

テスト用の `fastify.inject()` API を使いましょう。

## くわしく

### なぜ

今開発してるサービスでは、API サーバーに Fastify を採用し、 `@fastify/swagger` で OpenAPI ドキュメントを自動生成している。当然フロントエンドもあって、そちらでは [OpenAPI TypeScript](https://openapi-ts.dev/) を利用し、API サーバーの OpenAPI ドキュメントから型を生成している。

ここで問題になるのは、API サーバーの OpenAPI ドキュメントが、サーバーを起動しているときしかアクセスできない、ということだ。

ローカルでの開発中は API サーバーを起動しているから、起動中のサーバーが提供する OpenAPI ドキュメントを利用して、型を生成できる。しかし、型生成を個々人のローカル環境のみで行うのは少々リスクがある。生成された型が最新のコミットを反映したものであること、そしてその最新の型に即した実装が行われていることが担保されないからだ。ひょっとしたら型の生成やコミットを忘れる可能性があるかもしれない。リモートの更新を pull したときに、型の更新を忘れる可能性もある。

こういったちょっとしたミスを防ぐためには型生成の自動化が必要だ。自動化は例えば Git の pre-commit フックを使う方法や、CI などがある。しかし pre-commit の度にローカルでサーバーを起動したり、CI 上でサーバーを起動するのはなかなかコストが大きい。サーバーの実装によっては DB やサードパーティの API が必要になる可能性もある。

そこで、どうにかしてサーバー全体を起動せずに OpenAPI ドキュメントを取得できないかなあ、という話になるわけだ。


### どうやって

(冒頭にも書いたけど)結論から言うと、 [`fastify.inject()`](https://fastify.dev/docs/v1.14.x/Documentation/Testing/) メソッドを使うとこれが実現できる。

このメソッドを使うと、`fastify.ready()` や `fastify.listen()` を呼ばずとも(つまりサーバーを起動せずとも)、リクエストを投げレスポンスを取得することができる。
なので、`@fastify/swagger` に必要な実装(主にルート周り)だけあれば OpenAPI ドキュメントが生成できてしまう。ルート周りの処理で DB が必要になるじゃん、という話もあるが、必要なのは各ルートで定義する `schema` だけなので、 `fastify.inject()` でそのルートにアクセスしなければルートのハンドラが呼ばれることはない。プラグインや DI でうまいことモジュラーな実装にしてあれば、DB コネクション周りを管理するプラグインを `register` しない、ということもできるはず。

OpenAPI TypeScript は CLI だけでなくコードから呼ぶための API もあるので、下記のように `fastify.inject()` で取得した OpenAPI ドキュメントをもとに OpenAPI TypeScript で型生成する、というコードが書ける。

```ts
import fs from 'node:fs/promises'
import path from 'node:path'
import fastifySwaggerPlugin from '@fastify/swagger'
import Fastify from 'fastify'
import openapiTS, { astToString, COMMENT_HEADER } from 'openapi-typescript'

async function generateOpenAPITypes() {
  // Fastify 準備
  const fastify = Fastify()
  await fastify,.register(fastifySwaggerPlugin, { /* @fastify/swagger の設定 */})
  
  // YAML フォーマットの OpenAPI ドキュメントを出力するエンドポイント
  await fastify.get('/openapi.yml', {}, async (req, reply) => fastify.swagger({ yaml: true }))

  // 各種ルートを登録するプラグイン(本番アプリと実装を共通化するためプラグイン化している)
  await fastify.register(routesPlugin)

  // OpenAPI ドキュメントの取得。body が yaml
  const { body } = await app.inject({
    method: 'GET',
    url: '/openapi.yml'
  })

  // OpenAPI TypeScript で型生成
  const ast = await openapiTS(body, { alphabetize: true })
  const types = astToString(ast)

  await fs.writeFile(
    path.join(imprt.meta.dirname, '..', 'openapi.d.ts'), 
    COMMENT_HEADER + types
  )
}
```

こんな感じ。

これを pre-commit フックで実行してもいいし、CI で実行して自動コミットしてもいい。
