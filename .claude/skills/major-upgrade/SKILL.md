---
name: major-upgrade
description: 依存ライブラリ・言語・ツールチェーンのメジャーバージョン更新を、breaking change の調査からレビュー・実行・検証まで段階的に進める手順。TypeScript / Node / Vite / Vitest / Biome / pnpm などのメジャーアップグレード全般で使用する。
---

# Major Version Upgrade

メジャーバージョン更新は「package.json の数値を上げる」だけでは済まないことが多く、安易に実行すると pre-existing なエラーと breaking change が混ざって収拾がつかなくなる。本 skill はその失敗パターンを避けるための 7 フェーズ構成。

## 使用する他 skill

- **[baseline-diff](../baseline-diff/SKILL.md)**: 検証コマンドが失敗したときに pre-existing と切り分ける。Phase 6 で必ず使う

## Phase 1 — 調査 (changelog & migration guide)

**目的**: 何が breaking change なのかを網羅的に把握する

- **公式一次ソース**を最優先: リリースノート blog post、GitHub リリースページ、公式ドキュメントの migration guide
- **コミュニティの migration guide**は補助情報として使うが**必ず複数ソースでクロスリファレンス**する。単一の gist や Medium 記事は hallucinated / 古い情報が混ざっていることがある
- 特に「既定値の変更」は情報ソース間で記述が食い違いやすい。例: TypeScript 6.0 の `strict` 既定値について、Microsoft devblog と非公式 gist で記述が違っていた
- WebFetch + WebSearch 両方を使って漏れを減らす
- 自分の知識カットオフより新しいバージョンの場合は必ず Web 検索する。「このくらいの変更だろう」と推測しない

調査結果は後で参照しやすいように**一時ファイル** (例: `/tmp/<tool>-migration-plan.md`) に書き出しておく。

## Phase 2 — サーベイ (コードベース側の影響面)

**目的**: 変更の影響を受けうる箇所を列挙する

典型的なサーベイ観点 (ツールによって調整):

- 設定ファイル (`tsconfig.json`, `vite.config.*`, `package.json` の scripts / exports / type フィールド, `biome.jsonc` 等)
- package.json 全件のバージョン固定・依存構造 / workspace pnpm の hoist 構造
- 当該ツールの API を直接 import している箇所 (`import ts from 'typescript'` など)
- **deprecated / 削除された言語機能 / 構文の使用箇所** (例: TS 6 なら `module Foo {}`, `import ... assert {}`, `baseUrl`, `outFile` 等を grep)
- 型定義の暗黙依存 (`@types/*` の auto-include, `typeRoots`, `types` フィールド)
- CI で実行されているコマンドと、ローカルでのみ実行されているコマンドの差分 (後者は漏れて壊れがち)

Explore エージェントを使うと効率的に集められる。結果は plan ファイルに追記。

## Phase 3 — プラン作成

**目的**: breaking change × 本リポの該当有無を一覧化して、対応必要な項目を絞る

推奨フォーマット:

```markdown
| # | breaking change | 本リポへの影響 | 判定 |
|---|-----------------|---------------|------|
| A | target: es5 deprecation | 全 tsconfig `target: esnext` | ✅ 影響なし |
| B | types 既定値 []化 | action-create-scrap が暗黙ロードに依存 | ⚠️ 要対応 |
...
```

さらに:

- **必須作業セクション**: 影響ありの項目ごとに具体的な diff を先に書く
- **検証手順セクション**: Phase 6 で走らせる検証コマンドを番号付きリストで明記。実行順も重要 (install → build → test の順)
- **ロールバック手順**: 失敗したときにどこに戻すか
- **スコープ外**: 今回やらないことを明示 (後続 PR 送りにする項目)
- **新機能採用セクション**: 以下の Phase 3.5 参照

### Phase 3.5 — 新機能採用の機会を探る (重要)

メジャー更新は「最小差分で修正するだけ」ではなく、新バージョンの新機能でコードベースを改善できないかを**積極的に**検討する。

- Phase 1 の changelog から新機能一覧を抽出
- 各新機能について「本リポで使えるパターンが grep で見つかるか」を確認
- 適用できる場合は plan に組み込む (例: TS 6 の `dom` への `dom.iterable` 統合に合わせた lib 整理)
- **採用しなかった新機能の見送り理由**も明記しておく (後で「なぜこれを使わなかったの？」と聞かれないように)

## Phase 4 — adversarial review (サブエージェント × 3 ラウンド以上)

**目的**: 実行前に見落としを潰す

Plan は自分で作ると盲点ができる。サブエージェント (`general-purpose` agent) に**批判的レビュアー**として投げる:

```
あなたは <X> マイグレーションの厳しいレビュアーです。
以下のマイグレーションプランを批判的にレビューし、
見落とし・誤り・リスクを指摘してください。

レビュー対象: /tmp/xxx-migration-plan.md
対象リポジトリ: <path>

観点:
1. breaking change の見落とし (実際にコードを grep して検証)
2. 検証手順の妥当性 (コマンドが本当に存在するか確認)
3. 新機能採用の正当性
4. ロールバック計画の妥当性
5. 周辺ツール互換性 (<具体ツール名列挙>)

アウトプット形式:
- 致命的な欠陥 / 要修正 / 提案 / 問題なし の 4 カテゴリ
- 各指摘に根拠 (読んだファイルパス・grep 結果) を添える
- 総合判定 (実行可能か / 要改訂か)
```

- 1 回目のレビュー → 指摘を plan に反映
- 2 回目 → 改訂版をさらに批判
- 3 回目 → 実行直前の go/no-go 判定
- 各ラウンドで**新しい観点**を与える (同じ観点だと同じ指摘しか出ない)
- **3 ラウンド以上**は必須。経験上、2 回目までに致命的な見落とし (検証手順の実行不能、pre-existing エラーの罠) が 1〜2 件見つかることが多い

## Phase 5 — 実行

Plan に従って変更を適用する。ただし:

- **1 ファイルずつ** or **論理単位ごと**にコミットできる粒度で作業する (後で分割コミットしやすくするため)
- 途中で Plan から逸脱する必要が生じたら、**逸脱の理由**を memo しておく (後の Phase 7 のコミットメッセージで使う)

## Phase 6 — 検証 (baseline-diff)

Plan の検証手順を順番に実行する。

**失敗したら即座に [baseline-diff](../baseline-diff/SKILL.md) skill を発動**:

1. 変更を `git stash`
2. base ブランチで同じコマンドを走らせる
3. 同じエラーが出れば pre-existing。別 PR 送り
4. 出なければ本物の breaking change 起因。修正
5. `git stash pop` で作業復帰

この切り分けを怠ると、pre-existing エラーを修正しようとして PR が肥大化したり、逆に本物の breaking change を見逃したりする。

## Phase 7 — コミット分割 & push

1 つの PR でも、意味的に独立した変更は別コミットに分ける:

- ✅ **メジャー更新そのもの** (tsconfig / 依存版数 の必須対応)
- ✅ **付随的に発覚した独立変更** (例: 関連ツール [Biome] の config migrate)
- ✅ **関連リファクタ** (例: ncc → rollup 移行など、メジャー更新で顕在化した問題の根本対応)

コミットメッセージには:

- **何を変えたか**だけでなく、**なぜ変えたか** (どの breaking change に対応したか)
- pre-existing なものは「pre-existing な … の修正」と明記
- 可能であれば、公式 migration guide の URL や commit hash を参照

最後に `git push`。

## チェックリスト

- [ ] Phase 1: 公式 + コミュニティソース最低 2 つ以上で breaking change をクロスリファレンス
- [ ] Phase 2: 影響面を grep ベースで列挙
- [ ] Phase 3: breaking change × 該当有無の表を plan に書いた
- [ ] Phase 3.5: 新機能採用の機会を積極的に検討した (採用/見送りの理由を残した)
- [ ] Phase 4: サブエージェントレビュー **3 ラウンド以上**完了
- [ ] Phase 5: Plan に沿って実行、逸脱は memo
- [ ] Phase 6: 失敗したら baseline-diff で必ず切り分けた
- [ ] Phase 7: 意味単位でコミット分割、メッセージに why を含めた
