---
layout: post
title: Jestのテスト環境をディレクトリで切り替える
category: programming
tags:
  - Node.js
  - Jest
  - TIL
---

Nuxt.js のプロジェクトで Jest のテストを書くときに、下記のような要件がある

- 基本的に jsdom 環境でテストを動かしたい
- しかし `./server` ディレクトリ配下は `node` 環境でテストしたい

今までは `.jest.config.js` でデフォルトの環境を `jsdom` にし、サーバのテストは地道に

```typescript
/**
 * @jest-environment node
 */
```

を書いていた。

これでもワークするんだけど、やはりたまにお作法を忘れて「あれ、`setImmediate` 存在しないとか怒られるんだけど」とかで数十分溶かしたりする。

根本的になんとかならんかな、と思って Jest のドキュメント読んでたら [`projects`](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig) で実現できた。

```javascript
/** @type {import('jest').Config} */
module.exports = {
    collectCoverage: true,
    moduleNameMapper: {...},
    moduleFileExtensions: ['ts', 'js', 'vue', 'json', 'svg'],
    transform: {...},
    setupFilesAfterEnv: ['<rootDir>/test/helpers/jest-vue.setup.ts'],
    testEnvironment: 'jsdom'
}
```

これが

```javascript
/** @type {import('jest').Config} */
const base = {
    moduleNameMapper: {...},
    moduleFileExtensions: ['ts', 'js', 'vue', 'json', 'svg'],
    transform: {...},
}

/** @type {import('jest').ConFig} */
module.exports = {
    collectCoverage: true,
    projects: [
        {
            ...base,
            displayName: 'front',
            testMatch: ['<rootDir>/**/*.spec.ts'],
            testPathIgnorePatterns: ['<rootDir>/server/'],
            setupFilesAfterEnv: ['<rootDir>/test/helpers/jest-vue.setup.ts'],
            testEnvironment: 'jsdom',
        },
        {
            ...base,
            displayName: 'server',
            testMatch: ['<rootDir>/server/**/*.spec.ts'],
            testEnvironment: 'node',
        }
    ]
}
```

こうなる。

`collectCoverage` とか、カバレッジ系はルートの設定に書く必要がある。
