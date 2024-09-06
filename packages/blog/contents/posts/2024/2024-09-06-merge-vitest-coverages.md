---
layout: post
title: Vitest のカバレッジをマージする
tags:
  - TIL
  - Vitest
  - GitHub Actions
  - Node.js
---

Vitest カバレッジファイル複数をマージしたいときどうするか

**目次**
[[toc]]

## TL;DR

`coverage-final.json` は `nyc merge` でマージできる。  
`coverage-summary.json` は `nyc` でマージできないので、手動で頑張りましょう。

モノレポ環境のときは、Vitest workspace 使うのが正道です。

## どうして

- Turborepo を導入したモノレポ環境
- CI では Turborepo が差分検知したパッケージだけテストを実行する
- 現状テストが実行されたパッケージはそれぞれレポートを個別にコメントしている
- しかしパッケージが増えてきたため、PR にコメントがつきすぎて分かりづらい
- → そうだカバレッジマージしよう

## どうやる

基本的には [How I can merge two different coverage folder? · vitest-dev/vitest · Discussion #3744](https://github.com/vitest-dev/vitest/discussions/3744) がそのまま答え。

[Vitest の Workspace 機能](https://vitest.dev/guide/workspace.html) 使うのが正道。

でも必要であれば [`nyc merge` でマージできる](https://github.com/istanbuljs/nyc#combining-reports-from-multiple-runs)。

しかし、上述の `nyc merge` でマージできるのは `coverage-final.json` のみで、`coverage-summary.json` はマージできない。自分でなんとかする必要がある。

### coverage-summary.json をマージする

`coverage-summary.json` は下記のような内容になっている。

```json
{
  "total": {
    "lines": {
      "total": 1627,
      "covered": 1270,
      "skipped": 0,
      "pct": 78.05
    },
    "statements": {
      "total": 1627,
      "covered": 1270,
      "skipped": 0,
      "pct": 78.05
    },
    "functions": {
      "total": 78,
      "covered": 54,
      "skipped": 0,
      "pct": 69.23
    },
    "branches": {
      "total": 135,
      "covered": 102,
      "skipped": 0,
      "pct": 75.55
    },
    "branchesTrue": {
      "total": 0,
      "covered": 0,
      "skipped": 0,
      "pct": 100
    }
  },
  "/Users/yshrsmz/repos/github.com/yshrsmz/coverage-sample/app/src/app.ts": {
    "lines": {
      "total": 33,
      "covered": 0,
      "skipped": 0,
      "pct": 0
    },
    "functions": {
      "total": 1,
      "covered": 0,
      "skipped": 0,
      "pct": 0
    },
    "statements": {
      "total": 33,
      "covered": 0,
      "skipped": 0,
      "pct": 0
    },
    "branches": {
      "total": 1,
      "covered": 0,
      "skipped": 0,
      "pct": 0
    }
  },
}
```

`total` というエントリーのあとに、ファイル毎のカバレッジサマリーがずらずらと並んでいる。
基本的には `total` もファイル毎も構成は変わらない。 `pct` はそのまんまカバー率である。

マージしたい `coverage-summary.json` 間でファイルが重複しないのであれば、

1. ファイル毎のサマリー情報を追加していく
2. `total` については加算していく
3. 一通りマージし終わった後に、 `total.*.pct` を計算する

というフローでいけそうだ。

### カバレッジファイルを収集する

`pnpm` を採用しているので、 `pnpm ls -r --depth -1 --json` でパッケージ一覧が取得できる。取得した後は `jq` で名称とパスを取り出してあげる

```js
import fs from 'node:fs'
import path from 'node:path'

// exec は https://github.com/actions/toolkit/tree/main/packages/exec
export async function collectCoverages(exec) {

  // パッケージのパスと名前を取得
  let packagePaths = []
  await exec.exec(
    '/bin/bash',
    [
      '-c',
      // ルートパッケージ(coverage-sample)は除外
      `pnpm ls -r --depth -1 --json | jq -r -c '.[] | {name:.name, path:.path} | select(.name != "coverage-sample")'`,
    ],
    {
      listeners: {
        stdout: (data) => {
          packagePaths.push(
            ...data
              .toString()
              .split('\n')
              .filter((item) => !!item)
              .map((item) => JSON.parse(item)),
          )
        },
      },
    },
  )

  if (!fs.existsSync('./coverage')) {
    fs.mkdirSync('./coverage/final', { recursive: true })
    fs.mkdirSync('./coverage/summary', { recursive: true })
  }

  // 各パッケージからカバレッジファイルを収集
  packagePaths.forEach((pkg) => {
    const coverageFinalPath = path.resolve(
      pkg.path,
      'coverage/coverage-final.json',
    )
    const coverageSummaryPath = path.resolve(
      pkg.path,
      'coverage/coverage-summary.json',
    )
    if (fs.existsSync(coverageFinalPath)) {
      fs.copyFileSync(
        coverageFinalPath,
        `./coverage/final/${pkg.name.replace('@', '').replace('/', '_')}-coverage-final.json`,
      )
    }
    if (fs.existsSync(coverageSummaryPath)) {
      fs.copyFileSync(
        coverageSummaryPath,
        `./coverage/summary/${pkg.name.replace('@', '').replace('/', '_')}-coverage-summary.json`,
      )
    }
  })
}
```

これでレポジトリルートの `coverage` ディレクトリに、全パッケージのカバレッジレポートが集まった。 final と summary でディレクトリを分けているので集計も簡単。

### `coverage-final.json` をマージする

これは先述の通り簡単。

```shell
pnpm dlx nyc merge ./coverage/final ./coverage/coverage-final.json
```

で完了。

### `coverage-summary.json` をマージする

前前項で収集した ./coverage/*-coverage-summary.json` を集計していく。まあこれもそんなに難しくない

```js
import fs from 'node:fs'
import path from 'node:path'

function calculatePercentage(covered, total) {
  return ((covered * 10000) / total / 100).toFixed(2)
}

export async function mergeCoverageSummaries() {
  let coverageSummary = {}

  if (!fs.existsSync('./coverage/summary')) {
    return
  }

  // 各パッケージのカバレッジサマリーファイルをマージ
  fs.readdirSync('./coverage/summary')
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.resolve('./coverage/summary', file))
    .map((file) => JSON.parse(fs.readFileSync(file, 'utf8')))
    .forEach((json) => {
      const prevTotal = coverageSummary.total
      const total = {
        lines: {
          total: (prevTotal?.lines?.total ?? 0) + json.total.lines.total,
          covered: (prevTotal?.lines?.covered ?? 0) + json.total.lines.covered,
          skipped: (prevTotal?.lines?.covered ?? 0) + json.total.lines.skipped,
        },
        statements: {
          total:
            (prevTotal?.statements?.total ?? 0) + json.total.statements.total,
          covered:
            (prevTotal?.statements?.covered ?? 0) +
            json.total.statements.covered,
          skipped:
            (prevTotal?.statements?.skipped ?? 0) +
            json.total.statements.skipped,
        },
        functions: {
          total:
            (prevTotal?.functions?.total ?? 0) + json.total.functions.total,
          covered:
            (prevTotal?.functions?.covered ?? 0) + json.total.functions.covered,
          skipped:
            (prevTotal?.functions?.skipped ?? 0) + json.total.functions.skipped,
        },
        branches: {
          total: (prevTotal?.branches?.total ?? 0) + json.total.branches.total,
          covered:
            (prevTotal?.branches?.covered ?? 0) + json.total.branches.covered,
          skipped:
            (prevTotal?.branches?.skipped ?? 0) + json.total.branches.skipped,
        },
        branchesTrue: {
          total:
            (prevTotal?.branchesTrue?.total ?? 0) +
            json.total.branchesTrue.total,
          covered:
            (prevTotal?.branchesTrue?.covered ?? 0) +
            json.total.branchesTrue.covered,
          skipped:
            (prevTotal?.branchesTrue?.skipped ?? 0) +
            json.total.functions.skipped,
        },
      }
      coverageSummary = { ...coverageSummary, ...json, total }
    })

  // カバレッジの計算
  coverageSummary.total.lines.pct = calculatePercentage(
    coverageSummary.total.lines.covered,
    coverageSummary.total.lines.total,
  )
  coverageSummary.total.statements.pct = calculatePercentage(
    coverageSummary.total.statements.covered,
    coverageSummary.total.statements.total,
  )
  coverageSummary.total.functions.pct = calculatePercentage(
    coverageSummary.total.functions.covered,
    coverageSummary.total.functions.total,
  )
  coverageSummary.total.branches.pct = calculatePercentage(
    coverageSummary.total.branches.covered,
    coverageSummary.total.branches.total,
  )
  if (
    coverageSummary.total.branchesTrue.covered === 0 &&
    coverageSummary.total.branchesTrue.total === 0
  ) {
    coverageSummary.total.branchesTrue.pct = 'Unknown'
  } else {
    coverageSummary.total.branchesTrue.pct = calculatePercentage(
      coverageSummary.total.branchesTrue.covered,
      coverageSummary.total.branchesTrue.total,
    )
  }

  fs.writeFileSync(
    './coverage/coverage-summary.json',
    JSON.stringify(coverageSummary),
    'utf8',
  )
}
```

大変ざっくりこんな感じ。`total` を愚直に加算して、最後にカバー率を計算してあげればいい。

あとはこれを GitHub Actions から呼んであげればいい。

### GitHub Actions のキャッシュどうするの

Turborepo ベースで話をすると、Turborepo のキャッシュをちゃんとしてあげれば、 `cache hit` したパッケージもカバレッジファイルがちゃんと出力される。

[davelosert/vitest-coverage-report-action
](https://github.com/davelosert/vitest-coverage-report-action) つかってベースブランチとの差分も表示したいのであれば、レポジトリルートにつくった `coverage` ディレクトリも別途キャッシュしておく必要がある。
