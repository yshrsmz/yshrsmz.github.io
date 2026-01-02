---
layout: post
title: Keyboardio Atreus を Vial で使う
category: diary
tags:
  - keyboard
---

Keyboardio Atreus のファームウェアを vial-qmk に載せ替えて、Vial でキーマップやコンボを管理できるようにした話。

**目次**
[[toc]]

## はじめに

Keyboardio Atreus はデフォルトで Chrysalis というファームウェアを使っている。Chrysalis でもキーマップの変更はできるのだが、コンボやタップダンスといった高度な設定を GUI で行うことができない。

最近 Cornix で Vial を使うようになり、その便利さを実感している。リアルタイムでキーマップを変更できる手軽さは一度味わうと戻れない。そこで Atreus でも Vial を使えるようにしたいと思った。

## vial-qmk を使う

Vial 公式が [vial-qmk](https://github.com/vial-kb/vial-qmk) という QMK ファームウェアのフォークをメンテナンスしている。Keyboardio Atreus 用の設定も含まれているので、これを使えば Vial を導入できる。各キーボードディレクトリの、`keymaps/vial` を利用する。

ただし、デフォルトの設定だと `QMK_SETTINGS` が無効になっている。`QMK_SETTINGS` を有効にすると、Vial の GUI から以下のような設定を調整できるようになる。

- タップダンスのタイミング調整
- ロングタップ（Mod-Tap）の判定時間
- 同時押し時のホールドモードへの即時切り替え
- その他 QMK 系ファームウェアの細かな挙動

これらの設定を GUI で調整できるのは非常に便利なので、有効にしたい。

## QMK_SETTINGS を有効にするためのパッチ

問題は、`QMK_SETTINGS` を有効にするとファームウェアのサイズが増えて、Atreus のフラッシュメモリに収まらなくなること。そこで、使わない QMK の機能を無効化してファームウェアサイズを削減し、`QMK_SETTINGS` のための容量を確保する。

以下のパッチを [vial-qmk](https://github.com/vial-kb/vial-qmk) に当てる。対象コミットは `ab824d6becfdb3dfcbc08041649612ea1906f8d5`。

```patch
diff --git a/keyboards/keyboardio/atreus/keymaps/vial/config.h b/keyboards/keyboardio/atreus/keymaps/vial/config.h
index f2e336b..2dc4978 100644
--- a/keyboards/keyboardio/atreus/keymaps/vial/config.h
+++ b/keyboards/keyboardio/atreus/keymaps/vial/config.h
@@ -8,4 +8,6 @@
 #define VIAL_UNLOCK_COMBO_COLS { 0, 1, 7, 10, 11}
 
 #define DYNAMIC_KEYMAP_LAYER_COUNT 4
- 
+
+// #define VIAL_TAP_DANCE_ENTRIES 8
+// #define VIAL_COMBO_ENTRIES 8
diff --git a/keyboards/keyboardio/atreus/keymaps/vial/rules.mk b/keyboards/keyboardio/atreus/keymaps/vial/rules.mk
index 35d359f..42f5412 100644
--- a/keyboards/keyboardio/atreus/keymaps/vial/rules.mk
+++ b/keyboards/keyboardio/atreus/keymaps/vial/rules.mk
@@ -1,7 +1,16 @@
 VIA_ENABLE = yes
 VIAL_ENABLE = yes
 LTO_ENABLE = yes
-QMK_SETTINGS = no
+QMK_SETTINGS = yes
 CONSOLE_ENABLE = no
 COMMAND_ENABLE = no
-
+UNICODE_ENABLE = no
+MOUSEKEY_ENABLE = no
+KEY_OVERRIDE_ENABLE = no
+LAYER_LOCK_ENABLE = no
+REPEAT_KEY_ENABLE = no
+CAPS_WORD_ENABLE = no
+NKRO_ENABLE = no
+SPACE_CADET_ENABLE = no
+GRAVE_ESC_ENABLE = no
+MAGIC_ENABLE = no
```

### パッチの解説

このパッチでは以下の変更を行っている:

**config.h の変更:**
- `VIAL_TAP_DANCE_ENTRIES` と `VIAL_COMBO_ENTRIES` の行をコメントアウト（デフォルト値を使用）

**rules.mk の変更:**
- `QMK_SETTINGS = yes` に変更して QMK Settings を有効化
- 以下の機能を無効化してファームウェアサイズを削減:
  - `UNICODE_ENABLE` - Unicode 入力（使わない）
  - `MOUSEKEY_ENABLE` - マウスキー（使わない）
  - `KEY_OVERRIDE_ENABLE` - キーオーバーライド
  - `LAYER_LOCK_ENABLE` - レイヤーロック
  - `REPEAT_KEY_ENABLE` - リピートキー
  - `CAPS_WORD_ENABLE` - Caps Word
  - `NKRO_ENABLE` - N-Key Rollover（6KRO で十分）
  - `SPACE_CADET_ENABLE` - Space Cadet Shift
  - `GRAVE_ESC_ENABLE` - Grave Escape
  - `MAGIC_ENABLE` - Magic キーコード

これらは自分の使い方では不要な機能なので無効化している。必要に応じて有効にしても良いが、ファームウェアサイズには注意が必要。

## ビルドとフラッシュ

パッチを当てたら、以下のコマンドでビルドする:

```bash
make keyboardio/atreus:vial
```

ビルドが成功したら、生成された `.hex` ファイルを Atreus にフラッシュする。フラッシュには QMK Toolbox を使うのが簡単。

1. QMK Toolbox を起動
2. 生成された `keyboardio_atreus_vial.hex` を選択
3. Atreus をブートローダーモードにする（ESC を押しながら USB を接続）
4. Flash ボタンをクリック

フラッシュが完了したら、[Vial](https://get.vial.today/) を起動してキーボードが認識されることを確認する。

## おまけ: 無効にする機能の割り出し方

どうやって無効にするフラグを決めたかというと、Claude Code にファームウェアのビルドを繰り返し実行してもらった。

QMK のビルドは、ファームウェアサイズが上限を超えるとエラーになり、どれだけオーバーしているかを表示してくれる。このエラーメッセージを見ながら、Claude Code に「サイズを削減するために無効にできる機能を探して」と指示すると、`rules.mk` の設定を試行錯誤してくれる。

ただし、たまに使いたい機能まで無効にしてしまうことがある。そういう場合は、

- 事前に「`TAP_DANCE_ENABLE` は残しておいて」と伝えておく
- 無効にされたら「それは使いたいから戻して」とフィードバックする

こうしたやり取りを繰り返すことで、自分にとって不要な機能だけを無効化し、必要な機能を残したまま `QMK_SETTINGS` を有効にできるサイズに収めることができた。

## まとめ

Keyboardio Atreus に Vial を導入することで、GUI からリアルタイムにキーマップやコンボ、タップダンスの設定を変更できるようになった。さらに `QMK_SETTINGS` を有効にしたことで、各種タイミング設定も GUI から調整できる。

Chrysalis と比べて設定の自由度が大幅に上がるので、Atreus ユーザーにはおすすめです。

## 参考

- [vial-qmk/keyboards/keyboardio/atreus at vial · vial-kb/vial-qmk](https://github.com/vial-kb/vial-qmk/tree/vial/keyboards/keyboardio/atreus)
- [Configuring QMK | QMK Firmware](https://docs.qmk.fm/config_options#feature-options)
- [Select Vial GUI features (for size) - Vial](https://get.vial.today/docs/firmware-size.html#qmk-settings)
- [Chrysalis](https://chrysalis.keyboard.io/)
