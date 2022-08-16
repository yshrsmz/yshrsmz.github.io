---
layout: post
title: YarnとReactとTypeScriptとDuplicate identifierエラー
category: programming
tags:
  - react
  - typescript
  - yarn
  - renovate
  - TIL
---

React と TypeScript で使っていると、型定義の更新時に下記のようなエラーに遭遇することがある

```
Run yarn app:build
Error: ../../node_modules/@types/react-dom/node_modules/@types/react/index.d.ts(3047,14): error TS2300: Duplicate identifier 'LibraryManagedAttributes'.
Error: ../../node_modules/@types/react/index.d.ts(3047,14): error TS2300: Duplicate identifier 'LibraryManagedAttributes'.
Error: Process completed with exit code 2.
```

@types/react の型定義が複数あって解決に失敗している感じ。

`yarn.lock` を作り直せばもちろん解決できるんだけど、もっとスマートなやり方があった。

yarn v1 だったら [atlassian/yarn-deduplicate](https://github.com/atlassian/yarn-deduplicate) を使えばいいし、 yarn v2 だったらビルトインコマンドの [`yarn dedupe`](https://yarnpkg.com/cli/dedupe) を使えばよい。

renovate を利用してパッケージ更新をしているなら、[postUpdateOptions](https://docs.renovatebot.com/configuration-options/#postupdateoptions) で `yarnDedupeFewer` か `yarnDedupeHighest` を設定してあげればいい感じにしてくれそう。

