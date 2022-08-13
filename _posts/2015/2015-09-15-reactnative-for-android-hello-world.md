---
layout: post
title: ReactNative for AndroidでHello World(セットアップ方法とか)
category: programming
tags:
  - android
  - reactnative
  - javascript
---

ついにReactNative for Androidが[リリース](https://code.facebook.com/posts/1189117404435352/)されました。  
とりあえず簡単にセットアップ方法をご紹介します。

ReactNativeの公式インストラクションは[こちら](http://facebook.github.io/react-native/docs/getting-started.html)。

## 実行環境

### Mac OS X 
今のところOS Xのみサポートされているようです。

### Homebrew
nvm, watchman, flowをインストールするのに利用します。

### Node.js 4.0以上
nvm経由でインストールしましょう。あるいはnodebrew使ってもいいし、直接入れてもよいです。  
Terminalで使えるように環境変数の設定とかも必要です。

### watchman

Node.jsのファイル監視関係のバグを回避するためにもwatchmanを利用するのがいいみたいです。

`brew install watchman`

### flow

flowを使いたい場合はこれもhomebrewからインストールします。

`brew install flow`


### Android SDK

Android向けの開発なのでAndroid SDKが必要です。  
未インストールの方は[こちら](http://facebook.github.io/react-native/docs/android-setup.html)の手順にしたがって設定してください。

※私の環境では実機(Nexus6 5.1.1)で動かすことができなかったので、エミュレータのインストールもしておくといいと思います。  
※2015/09/17追記: [実機でのデバッグ方法わかりました](/2015/09/17/reactnative-for-android-debugging-on-real-device/)


## ReactNativeのインストール

下記コマンドを実行します

```
npm install -g react-native-cli
react-native init AwesomeProject
cd AwesomeProject
```

`AwesomeProject` はプロジェクト名なので、なんでもいいです。

## サンプルアプリをAndroid実機で実行する

下記のコマンドを実行すると、エミュレータでアプリが起動します。

`react-native run-android`

## コードに変更を加え、リロードする

適当にコードを書き換えてみましょう。
コードに変更を加えたら、エミュレータ上で `F2` を押すとメニューが表示されます。  
"Reload JS" をクリックすると画面がリロードされ、コードの変更がエミュレータにも反映されます。

<iframe width="560" height="315" src="https://www.youtube.com/embed/IWSpgx24mAU" frameborder="0" allowfullscreen></iframe>

(クリックするとyoutubeにとびます)



ReactJSでついにAndroidアプリがつくれるようになった…と思うとテンション上がりますね。  
豊富なnode.jsの資産を使えるので、色々夢が広がります。
TitaniumMobileのようにならないか心配ですが、Webでもある程度市民権を得ている技術ではあるので、それなりに流行るんじゃないかなー、と思ってます。

こちらからは以上です。  
追って簡単なアプリとかも作ってみようと思います。

## 参考リンク
- [React Native for Android: How we built the first cross-platform React Native app | Engineering Blog | Facebook Code](https://code.facebook.com/posts/1189117404435352/)
- [Getting Started – React Native | A framework for building native apps using React](http://facebook.github.io/react-native/docs/getting-started.html)
