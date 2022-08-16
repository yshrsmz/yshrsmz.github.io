---
layout: post
title: (Android) App Signingなアプリの課金デバッグをしたい
category: programming
tags:
  - TIL
  - android
---

## TL;DR

PlayStoreから一度アプリをインストールした後、アンインストールしてパッケージ名を揃えたデバッグビルドをインストールしたらよい。

## App Signingでも課金でバッグしたい

Google Play App Signing、便利だけど手元にあるのはAPKアップロード用の鍵なので、課金のデバッグはできないものと思っていた。
でも、調べてみると結構簡単にエミュレータ上のデバッグビルドでも課金することができた。

手順は簡単。

1. PlayStoreからアプリをインストールする
2. アプリをアンインストールする
3. 本番のapplication idでデバッグ版をビルド、いつもどおりにAndroid Studioからデバッグする

これだけ。
もちろん対象アカウントのテスター登録とかアルファ版に課金Permission入れたAPKをアップロードするとか、通常の課金テストで必要な手順は一通り必要。

一つ注意点があって、この方法だとGoogle PlayのDeveloperコンソールから課金キャンセルした場合に、キャンセルが反映されない。  
おそらく署名が違うから正常にリモートから情報を取得できないのだと思う。  
この場合は一度デバッグビルドをアンインストールして、再度上記のPlayStoreからインストールする手順を踏めば良い。

## 参考
- [Google Play App Signing環境でのアプリ課金実装方法について](https://groups.google.com/forum/#!topic/Android-group-japan/j3rLbdiLq2w)
- [How can i test in-app payments when Google Play App Signing feature is enabled?
](https://stackoverflow.com/questions/45993630/how-can-i-test-in-app-payments-when-google-play-app-signing-feature-is-enabled)
