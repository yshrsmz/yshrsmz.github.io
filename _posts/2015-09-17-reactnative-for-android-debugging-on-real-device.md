---
layout: post
title: ReactNative for Androidで実機をデバッグに使うには
categories:
  - programming
tags:
  - android
  - reactnative
  - javascript
---

先ごろ"[ReactNative for AndroidでHello World(セットアップ方法とか)](https://yslibrary.net/2015/09/15/reactnative-for-android-hello-world/)"という記事を書きましたが。そこで、

> ※私の環境では実機(Nexus6 5.1.1)で動かすことができなかったので、エミュレータのインストールもしておくといいと思います。

というふうに書きました。

その後、ドキュメントを読み漁ってAndroidの実機でデバッグする方法がわかったのでアップデートしておきます。

すごく簡単で、一つコマンドを実行するだけです。

```
adb reverse tcp:8081 tcp:8081
```

これで、Macで実行したReact Packagerを実機から参照することができるようになります。  
[Getting Started](http://facebook.github.io/react-native/docs/getting-started.html#content)に書いておけよ…って話ですが、[Running On Device (Android)](http://facebook.github.io/react-native/docs/running-on-device-android.html#content)にしっかりと書いてありました。

実機では端末を振るとメニューが出てきます。

こちらからは以上です。
