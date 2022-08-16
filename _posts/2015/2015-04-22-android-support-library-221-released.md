---
layout: post
title: Android Supoprt Library 22.1がリリースされたので変更点など
category: programming
tags:
  - Android
---

2015/4/21、Android Support Libraryの22.1が公開されました。  
[公式ブログ](http://android-developers.blogspot.jp/2015/04/android-support-library-221.html)から変更点を抄訳してます

## Support v4

- [`DrawableCompat`](http://developer.android.com/reference/android/support/v4/graphics/drawable/DrawableCompat.html)で、drawable tintingがAPI4以上で使用可能に
  - [`DrawableCompat.wrap(Drawable)`](http://developer.android.com/reference/android/support/v4/graphics/drawable/DrawableCompat.html)でdrawableをラップして、[`setTint()`](http://developer.android.com/reference/android/support/v4/graphics/drawable/DrawableCompat.html#setTint(android.graphics.drawable.Drawable,%20int)), [`setTintList()`](http://developer.android.com/reference/android/support/v4/graphics/drawable/DrawableCompat.html#setTintList(android.graphics.drawable.Drawable,%20android.content.res.ColorStateList)), [`setTintMode()`](http://developer.android.com/reference/android/support/v4/graphics/drawable/DrawableCompat.html#setTintMode(android.graphics.drawable.Drawable,%20android.graphics.PorterDuff.Mode))を使おう
- [`Palette`](https://developer.android.com/reference/android/support/v7/graphics/Palette.html)の内部ロジックの一部を[`ColorUtils`](https://developer.android.com/reference/android/support/v7/graphics/Palette.html)で公開
- Lollipopで追加された、[building authentic motion](http://www.google.com/design/spec/animation/authentic-motion.html)の重要な要素のInterpolatorをSupport v4に追加
  - [`FastOutLinearInInterpolator`](http://developer.android.com/reference/android/support/v4/view/animation/FastOutLinearInInterpolator.html)
  - [`FastOutSlowInInterpolator`](http://developer.android.com/reference/android/support/v4/view/animation/FastOutSlowInInterpolator.html)
  - [`LinearOutSlowInInterpolator`](http://developer.android.com/reference/android/support/v4/view/animation/LinearOutSlowInInterpolator.html)
- [`PathInterpolatorCompat`](http://developer.android.com/reference/android/support/v4/view/animation/PathInterpolatorCompat.html)を追加
- [`Space`](http://developer.android.com/reference/android/support/v4/widget/Space.html) WidgetをGridLayout LibraryからSupport v4に移動


## AppCompat

- `ActionBarActivity`がDeprecatedに
- 代わりに[`AppCompatActivity`](http://developer.android.com/reference/android/support/v7/app/AppCompatActivity.html)を使うこと
- `AppCompatActivity`の内部ロジックは[`AppCompatDelegate`](http://developer.android.com/reference/android/support/v7/app/AppCompatDelegate.html)を通じてどんなActivityでも使える
  - ライフサイクルメソッド
  - テーマ
  - color tinting
  - etc...
  - もう`ActionBarActivity/AppCompatActivity`を継承する必要はない！(`AppCompatActivity`使うのが一番簡単なことに変わりはないけど)
- マテリアルデザインに対応した、[`AppCompatDialog`](http://developer.android.com/reference/android/support/v7/app/AppCompatDialog.html)の追加
- `AlertDialog`と同じAPIの[`support.v7.app.AlertDialog`](http://developer.android.com/reference/android/support/v7/app/AlertDialog.html)も追加(`AppCompatDialog`の機能を含む)
- WidgetのColorTintingは、下記のWidgetを使うことでレイアウトのinflate時に自動的に行われる。既存のものと置き換えて使おう
  - `AppCompatAutoCompleteTextView`
  - `AppCompatButton`
  - `AppCompatCheckBox`
  - `AppCompatCheckedTextView`
  - `AppCompatEditText`
  - `AppCompatMultiAutoCompleteTextView`
  - `AppCompatRadioButton`
  - `AppCompatRatingBar`
  - `AppCompatSpinner`
  - `AppCompatTextView`
- API11以上で、各Viewに対して`android:theme`が使用可能に(`app:theme`はdeprecated)

## Leanback

(触ってないからよくわからん…)

- よりよい10インチ端末サポート
- 新しいガイドステップ機能のサンプル
- たくさんのBugfix!

## RecyclerView

- 新しいデータ構造[`SortedList`](http://developer.android.com/reference/android/support/v7/util/SortedList.html)
  - ソートされたデータの管理が簡便に
  - バッチ処理できる

## Palette

- パフォーマンスの向上。クオリティを指定しなくても6-8倍速くなった
- Builderパターンで初期化。`Palette.generate(Bitmap)`じゃなくて[`Palette.from(Bitmap)`](http://developer.android.com/reference/android/support/v7/graphics/Palette.html)を使って[`Palette.Builder`](http://developer.android.com/reference/android/support/v7/graphics/Palette.Builder.html)を取得してね

## RenderScript

- 信頼性とパフォーマンスの向上
- ネイティブのRenderScriptが使えるか、の判定アルゴリズムの改善
- [`ScriptIntrinsicHistogram`](http://developer.android.com/reference/android/support/v8/renderscript/ScriptIntrinsicHistogram.html)と[`ScriptIntrinsicResize`](http://developer.android.com/reference/android/support/v8/renderscript/ScriptIntrinsicResize.html)の追加

---
だいたいこんな感じです。  

ActionBarActivityがDeprecatedになったのが個人的には一番驚きました。  
Toolbarのサポートをしたり、名前と実態に齟齬が生まれてるのが理由だそうです。  

AppCompatがだいぶ充実したようなので、アプリのマテリアルデザイン対応が捗りそうですね

*[一応qiitaにも](http://qiita.com/yshrsmz@github/items/afac02fad7d54e8dca3b)

