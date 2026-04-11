---
name: baseline-diff
description: 変更を加えた後に検証コマンド (tsc / lint / build / test) が失敗したとき、同じコマンドを base ブランチで実行して「pre-existing なエラー」と「今回の変更が起因するエラー」を切り分ける手順。依存ライブラリのメジャー更新・Node / ツールチェーン更新・リファクタ作業などで検証が落ちたら真っ先に使う。
---

# Baseline Diff 検証

## いつ使うか

以下の状況で使う:

- ライブラリや言語のメジャー更新中に `tsc --noEmit` / `pnpm lint` / `pnpm build` / `pnpm test` 等が失敗した
- リファクタリング後にエラーが出て、それが自分の変更起因か元から壊れていたのかわからない
- 既存の CI では一度も実行されていないコマンドを手動で走らせたら大量エラーが出た
- レビュアーに「このエラー、元からあった？」と聞かれそうなとき

## やってはいけないこと

- **エラーを見てすぐに修正しようとする**。pre-existing なエラーまで巻き込んで「今回の変更」と混ぜると PR が肥大化し、コードレビューが困難になり、ロールバックも難しくなる
- pre-existing エラーを無言でスコープインしてコミットする（別 PR で対応すべき場合も多い）

## 手順

### 1. 現在の変更を退避

```bash
git stash
```

変更がまだステージされていない場合でも、追跡中のファイルは全て stash に退避される。新規ファイルがある場合は `git stash -u` を使う。

### 2. 検証対象の base ブランチに切り替え

通常は `development` や `main`。PR の場合はマージ先ブランチ。

```bash
git checkout development
```

### 3. 検証環境を base ブランチの状態に揃える

依存関係が変わっている可能性が高いので、必ず再インストール:

```bash
pnpm install --frozen-lockfile  # あるいは npm ci / yarn install --frozen-lockfile
```

### 4. 同じ検証コマンドを実行

失敗したコマンドをそのまま再実行する。

```bash
pnpm --filter <package> exec tsc --noEmit
# あるいは
pnpm lint
# 等
```

### 5. エラーの比較

- **base でも同じエラーが出る** → **pre-existing**。今回の PR のスコープ外。別 issue / 別 PR で対応する旨をメモして先に進む
- **base では出ない** → **今回の変更起因**。修正対象
- **一部だけ base でも出る** → 差分だけが本 PR 起因。対応範囲を絞り込める

### 6. 元の作業状態に復元

```bash
git checkout <元のブランチ>
pnpm install --frozen-lockfile
git stash pop
```

新規ファイルがあった場合は `git stash pop` で復元される。

## 実例: TypeScript 6 移行時の切り分け

本リポジトリで TypeScript 5.9 → 6 のマイグレーション中、`pnpm --filter @codingfeline/action-create-scrap exec tsc --noEmit` と `pnpm --filter ... package` (ncc ビルド) と `pnpm lint` の 3 つが全て大量エラーで失敗した。

baseline-diff で検証:

- `tsc --noEmit` エラー (`verbatimModuleSyntax` + CommonJS): **base でも同じエラー**。原因は TS 6 ではなく、package.json に `"type": "module"` がないため TS が CJS として解釈していたこと。CI が `tsc --noEmit` を走らせていなかったので顕在化していなかっただけ。**pre-existing**
- `ncc package` エラー: 同じ verbatimModuleSyntax 系エラーで **pre-existing**
- `pnpm lint` エラー (Biome 2.2.4 vs 2.4.10 スキーマミスマッチ): **base でも同じエラー**。**pre-existing**

→ この 3 つを TS 6 の breaking change と誤診断せずに済み、スコープを正確に切れた。

一方で ncc ビルド時の `TS5011: rootDir must be explicitly set` エラーは **base では出なかった** ので本物の TS 6 breaking change (`rootDir` 既定値変更) と判明し、対処に繋がった。

## 注意事項

- base ブランチが古い場合は `git fetch origin && git checkout origin/<base>` でリモートの最新を見るほうが正確
- 複数のツールチェーンが絡むときは、各ツールバージョンが base と branch で揃っていることを必ず確認する (例: TypeScript バージョンが変われば tsc エラーも変わる)
- 切り分けで判明した pre-existing エラーは**必ず記録**する。別 PR / 別 issue を立てるか、少なくとも PR の description に「scope out: ... は pre-existing」と書く
