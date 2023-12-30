---
layout: post
title: (Android) dimens.xmlでmatch_parent/wrap_contentを定義する
category: programming
tags:
  - Android
---

例えば、画面サイズや画面の向きによってレイアウトの幅や高さを変えたい時なんかに

```
// value/dimens.xml
<dimen name="container_width">match_parent</dimen>

//value-land/dimens.xml
<dimen name="container_width">400dp</dimen>
```

などど設定できるとレイアウトxmlを2つ用意する必要がないので非常にはかどります。

しかし `match_parent` は文字列なので、上記のコードはもちろん使えません。エラーになります。


`ViewGroup$LayoutParams` を見てみると、`match_parent`, `wrap_content` は下記の用に定義されています。

```java
/**
 * Special value for the height or width requested by a View.
 * MATCH_PARENT means that the view wants to be as big as its parent,
 * minus the parent's padding, if any. Introduced in API Level 8.
 */
public static final int MATCH_PARENT = -1;

/**
 * Special value for the height or width requested by a View.
 * WRAP_CONTENT means that the view wants to be just large enough to fit
 * its own internal content, taking its own padding into account.
 */
public static final int WRAP_CONTENT = -2;
```

この値をdimens.xmlに書けば `match_parent` や `wrap_content` が使える−−、とはいかないようです。

[こちらのStackOverflow](http://stackoverflow.com/questions/6859331/how-can-i-use-layout-width-using-resource-file#answer-19461468)によると、 `TypedValue#complexToDimensionPixelSize()` は負数の扱いを考慮していないようで、普通に `wrap_content` の値である `-2px` を書くと `-1` になってしまうようです。

この現象を回避するため、最終的なdimens.xmlは下記のようになります。

```xml
// value/dimens.xml
<dimen name="match_parent">-2px</dimen><!-- -1pxでもよい -->
<dimen name="wrap_content">-3px</dimen>
<dimen name="container_width">@dimen/match_parent</dimen>

//value-land/dimens.xml
<dimen name="container_width">400dp</dimen>
```

こちらからは以上です。

## 参考リンク
- [How can I use layout_width using resource file?](http://stackoverflow.com/questions/6859331/how-can-i-use-layout-width-using-resource-file)
- [Issue 61222:	TypedValue#complexToDimensionPixelSize() rounds negative dimensions incorrectly](https://code.google.com/p/android/issues/detail?id=61222&thanks=61222&ts=1382148635)
