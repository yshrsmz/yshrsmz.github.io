---
layout: post
title: SharedPreferences に末尾が改行になる文字列を保存するとよくわからんスペースが4つ追加される件
tags:
  - TIL
  - Android
---

なぜか4つスペースが追加されたしばらく悩んだ

**目次**
[[toc]]

## TL;DR

Android の仕様なので致し方なし。保存時にマーカー追加して、取得時にマーカー削除するような workaround が必要。

## くわしく

### 事象

SharedPreferences に保存する文字列の末尾に改行が含まれると、半角スペース4つが追加される。

```kt
prefs.edit()
  .putString("key", "test\n")
  .apply()
```

のような感じで保存すると、取得するときには `test\n    ` になってしまう。

コード的には上記のように保存していても、保存された xml には半角4文字が suffix された状態で格納されてしまう。

### Google の Issue Tracker にあった

- [Strings with line feeds incorrectly restored from SharedPreferences. [37032278] - Issue Tracker](https://issuetracker.google.com/issues/37032278)


SharedPreferences 周りの実装バグで、値の末尾に改行があると半角スペース4つが追加されてしまうらしい。値としての改行と、XML のインデントとしての改行が混同されているというかなんというか。

### 解決策

これも前述の issue にあった。
この半角スペース追加処理は我々側ではどうしようもないので、値を `"` で囲って保存し、取得時に `"` を削除する、というものだ。

```kt
fun String.wrapContent(): String {
  // multiline string 使って `"` をエスケープ、prefx, suffix に追加する
  return """"$this""""
}

fun String.unwrapContent(): String {
  // 追加した `"` を削除する
  return this.drop(1).drapLast(1)
}

fun test() {
  val value = "test\n"
  prefs.edit()
    .putString("key", value.wrapContent())
    .apply()

  val saved = prefs
    .getString("key", "DEFAULT_VALUE".wrapContent())
    .unwrapContent()

  val same = value == saved
}
```

ただこれ、単純に末尾に `$` とか、なにかマーカーとして扱える文字を保存時に追加→取得時に削除、で問題ない気もする。

しかしメンテ中アプリの場合、単純にこの実装してしまうとすでに保存されてる値の前後1文字ずつが削除されてしまうので注意が必要。私は注意してなかったのでやってしまいました。



## なんで今さら

もう10年近く運用してるアプリでなんで今さらこんな使用バグみたいなの踏むの、って思ったら今年の夏まで SharedPreferences 使ってなかったからだった。それまでは Tray とい SharedPreferences 互換の別ライブラリを使っていたんだけど、いい加減メンテされてなくて jCenter クローズとともに闇に消えたので、夏の minSdk 更新といっしょに大急ぎで SharedPreferences に移行したんでした。
