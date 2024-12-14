---
layout: post
title: "「まったりAndroid Framework Code Reading #2」に参加してきた"
category: programming
tags:
  - Android
---

「まったりAndroid Framework Code Reading #2」に参加してきた

ちょっと前の話ですが、[まったりAndroid Framework Code Reading #2](https://mandroidfcr.doorkeeper.jp/events/33925)というもくもくコード読む会に行ってきました。  
個々人でテーマ決めて、最後に成果を報告しあう感じ。

## テーマ

私は、 `WindowManager` を読んでみることにした。[最近公開したアプリ](https://play.google.com/store/apps/details?id=net.yslibrary.omnitweety)が他のアプリにの上にオーバーレイするタイプのモノで、 `WindowManager` をちょっと触ったからだ。


## 成果
`WindowManager` のコード自体はすぐに見つかった。

[`android.view.WindowManager.java`](http://tools.oesf.biz/android-6.0.0_r1.0/xref/frameworks/base/core/java/android/view/WindowManager.java)がインターフェイスで、実態は [`android.view.WindowManagerImpl.java`](http://tools.oesf.biz/android-6.0.0_r1.0/xref/frameworks/base/core/java/android/view/WindowManagerImpl.java) こっちのようだ。

ただ、基本的に処理は全て [`android.view.WindowManagerGlobal.java`](http://tools.oesf.biz/android-6.0.0_r1.0/xref/frameworks/base/core/java/android/view/WindowManagerGlobal.java) に委譲しているらしく、大した処理は書いてなかった。

ここでちょっと興味がずれて、 `getApplicationContext().getSystemService(Context.WINDOW_SERVICE)` を呼ぶとどんな感じで `WindowManager` が渡されるのか調べ始めた。

[`context.getSystemService(Context.WINDOW_SERVICE)`](http://tools.oesf.biz/android-6.0.0_r1.0/xref/frameworks/base/core/java/android/content/Context.java) を呼ぶと、[`android.app.SystemServiceRegistry.java`](http://tools.oesf.biz/android-6.0.0_r1.0/xref/frameworks/base/core/java/android/app/SystemServiceRegistry.java) から `WindowManagerImpl.java` が返される。どこからSystemServiceRegistryを呼んでるかはちょっと追えていない。


`WindowManager` は `ViewManager` を継承している。  
で、`ViewManager` には `ViewManager#addView` は `BadTokenException` や `InvalidDisplayException` を投げる、って書いてあるけどそれらのExceptionは `WindowManager` に定義してある。  
親interfaceのViewManagerに定義するか独立したクラスとして定義したほうがいいんじゃ？　って気もしたけどどうなんでしょうね。

## 感想
Frameworkのコードを読む機会ってあまりないので、（時間は圧倒的に足りないにしても）とても良い機会だった。今回はあまり役立ちそうな知見は得られなかったけど、OS標準アプリのコードとかRecyclerViewとか、いろいろ読んでみたいコードができた。  
次回以降もタイミングがあったら参加したい、と思える会でした。

こちらからは以上です。
