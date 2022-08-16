---
layout: post
title: Supportライブラリからandroidxに移行する
category: programming
tags:
  - TIL
  - android
  - kotlin
---

個人で作っているアプリを、SupportライブラリからAndroidxに移行した。  
いくつかハマりどころがあった。

基本的には、

1. Android Studioを3.2 Canaryに変更する
2. Android Gradle Pluginを`3.2.0-alpha17`以降に上げる
3. `targetSdkVersion`と`compileSdkVersion`を28に変更
4. Android Studioで`Refactor > Refactor to AndroidX`でコード書き換え

でOK、らしい。

ただ`build.gradle`で指定していたライブラリの依存関係が、変数使って外出ししていた関係か更新されなかった。  
そこは[公式の新旧アーティファクトID対応表](https://developer.android.com/topic/libraries/support-library/refactor)を見て自分で修正する必要があった。

他にもいくつかあって、

- `ConstraintLayout`のパッケージ名が`androidx.constraintlayout.widget.XXXX`(実際は`androidx.constraintlayout.XXXX`)
- androidx系のクラスがfully qualified nameでコード内に書かれてしまうので、importに変更する
- 一部クラスがそもそもimport文消された上にfully qualified nameに更新されず、参照エラーになってしまうのでimport文追加する
  - 私の環境ではArchitecture Componentsの`ViewModel`系がこのパターンになっていた？
  
だいたいこんな感じ。

dagger-androidとかサポートライブラリに依存してるやつは勝手に修正してくれるらしく、そのまま使うことができた。

参考: [Convert the project to androidx. by thagikura · Pull Request #436 · google/flexbox-layout](https://github.com/google/flexbox-layout/pull/436)


### ※2018/06/13追記

[ConstraintLayout 1.1.2がリリースされ](https://androidstudio.googleblog.com/2018/06/constraintlayout-112.html)、上記のパッケージが違う問題は修正されました。
