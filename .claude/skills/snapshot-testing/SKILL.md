---
name: snapshot-testing
description: packages/blog の Vue コンポーネントに対して vitest の HTML スナップショットテストを追加・更新する手順。「スナップショットテストを追加」「snapshot 更新」「VRT 的なテスト」などのリクエストで使用する。
---

# Snapshot Testing (packages/blog)

`packages/blog` は vitest 2.1.9 + `@vue/test-utils` + `happy-dom` で、Vue コンポーネントの `wrapper.html()` を `toMatchSnapshot()` 比較する構成。実ブラウザを使わない HTML 構造の回帰検知。

## 前提

- 設定: `packages/blog/vitest.config.ts` (happy-dom 環境 + `@vitejs/plugin-vue`)
- テスト配置: `packages/blog/.vitepress/theme/components/__tests__/<Component>.test.ts`
- スナップショット: `__snapshots__/<Component>.test.ts.snap` が自動生成
- vitepress が vite 5 固定なので vitest は **2.1.9** 系のまま。4.x に上げない (vite 6+ が必要になる)
- `@vitest/browser` は絶対に入れないこと。入れると optional peer で `msw` が引き込まれ `Ignored build scripts` 警告が出る

## テスト追加手順

1. テスト対象の Vue コンポーネントを確認 (`packages/blog/.vitepress/theme/components/<Name>.vue`)
2. `__tests__/<Name>.test.ts` を作成:

```ts
import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import <Name> from '../<Name>.vue'

test('<Name> renders expected HTML', () => {
  const wrapper = mount(<Name>, {
    props: { /* 必要な props */ },
  })
  expect(wrapper.html()).toMatchSnapshot()
})
```

3. 初回実行でスナップショットを生成:
   ```bash
   pnpm --filter @codingfeline/blog test
   ```
4. 生成された `.snap` ファイルを目視確認して git に含める

## スナップショット更新

意図的にコンポーネントの見た目/構造を変更した場合:

```bash
pnpm --filter @codingfeline/blog test:update
```

差分を `git diff` で必ず確認してからコミット。

## 注意事項

- `router-link`・`<ClientOnly>` など VitePress 固有コンポーネントを含む場合は `global.stubs` でスタブする
- 外部 API・グローバル state に依存するコンポーネントはそのままでは mount できない。props で注入できる形に分離するか、`global.provide` で注入
- 日付・乱数など非決定的な値が含まれる場合は `vi.setSystemTime()` や props 固定でテストを安定化
- スナップショットは「class 名と DOM 構造」のみ検知。Tailwind の実レンダリング結果 (色/レイアウト) は検知できない。ピクセル単位の VRT が必要なら別途 Playwright 導入を検討
- CI で snapshot 自動更新をしてはいけない。`test:update` はローカル手動のみ
