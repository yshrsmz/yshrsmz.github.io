---
layout: post
title: yarn install と NODE_ENV
category: programming
tags:
  - Node.js
  - docker
  - TIL
---

## TL;DR; 

`NODE_ENV=production` が設定済みの環境で `yarn install` を実行すると `yarn install --production` と同等の動作をする

---

言われてみればそれはそう、って感じではあるし、[ドキュメントにもそう書いてある](https://classic.yarnpkg.com/en/docs/cli/install#toc-yarn-install-production-true-false)。


```docker
ARG BUILD_ENV=production

FROM public.ecr.aws/bitnami/node:14.16.1 AS build-stage

ARG BUILD_ENV
ENV NODE_ENV=${BUILD_ENV}

RUN install_packages curl ca-certificates
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build:${BUILD_ENV}
RUN yarn install --production
RUN /usr/local/bin/node-prune

FROM public.ecr.aws/bitnami/node:14.16.1-prod AS production-stage

ARG BUILD_ENV
ENV NODE_ENV ${BUILD_ENV}

RUN install_packages curl ca-certificates

COPY --from=build-stage /app /app

WORKDIR /app

ENTRYPOINT [ "./node_modules/.bin/nuxt", "start" ]
```

こんな Dockerfile を書いて、 `BUILD_ENV=production` で実行した時に `yarn build:production` が失敗しててめっちゃつまった。エラー的には `ts-loader` が見つからないとかそんな感じ。

いろいろ書き換えながら試してたら、最初に書いてたとおり `NODE_ENV=production` と環境変数を設定しちゃってたのが原因だった。devDependencies がインストールされない状態。

> Yarn will not install any package listed in devDependencies if the NODE_ENV environment variable is set to production

[ドキュメントにもそう書いてあった](https://classic.yarnpkg.com/en/docs/cli/install#toc-yarn-install-production-true-false)。


今回の場合は、 build-stage ではそもそも `NODE_ENV` 必要なかったので `ENV NODE_ENV=${BUILD_ENV}` をこのステージから削除して解決。

ドキュメントはちゃんと読みましょう。
