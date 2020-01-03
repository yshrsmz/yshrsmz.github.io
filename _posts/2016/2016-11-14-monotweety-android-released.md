---
layout: post
title: 通知エリアからツイートするAndroidアプリ、Monotweetyを公開した(コードもあるよ)
category: programming;
tags:
  - android
  - twitter
  - monotweety
---

![header](https://raw.githubusercontent.com/yshrsmz/monotweety/master/assets/header.png)

掲題のとおり、アプリを[Google Play Storeに公開しました](https://play.google.com/store/apps/details?id=net.yslibrary.monotweety)。   
今回はコードも[GitHubで公開してます](https://github.com/yshrsmz/monotweety)。Apache v2です。 

名前は"Monotweety"。「モノツイーティ」と読みます。


機能はホントにシンプルで、「通知エリアからツイートする」だけです。

実際のところ通知エリアからツイートできるのはAndroid 7.0以降の端末だけで、それ未満の端末では通知をタップすると編集ダイアログが表示されます。

1. 通知から

![notification](https://lh3.googleusercontent.com/2qJiK92gIYxynwaFl5HPZt23cd60s_2djZLPVg_dIipvl-ykfWAvzTZAnO1hxclJxv6-1tXgOj0aNr6oKPbpykI4239Kl32xLZ8dJG_q07Whq1q1A3u60qSu9f8S4nTFVB2nYNRad5nzunaBYGAiwZ2SRw7LFwo6Gk8e_GjqU20BOOcvoYMs-vCbmEWIvBqr7UsFAEljrtqQ36h-4k2JRK4qsIY3Kk3ByU0lyQTKWmOE0n0d1kfUw0-MVFhlGzvbn8Ki1_18cVP9URmIN5Xfikkoy1Reuw1d1RR5ky-6LTZ5PUNB2iXX1kdKxLZVUKJ3thZImaZOuv8RzEsGKiR3hd7d5vEYt0F6qmmvplcPl8FUBNThdasF0PlbGN1NwIhTAc665Iegs7nZmVsu3vSVGBxmK9wHC9-MOnFBZkRK_hcRbOWexFLYescrI07mvRIyat6Ilys0RN-sKCQv5QYRLURe-LVRwgRKBO_EukLM95ABl1kfxIqmu0dH0iVBeW7894flNCCaoeDNz0xYUJd07xW7vyIfLEv9WA1sciOFvnMzE3Ab8mjPFNG_KoHM1i6KVx_jgEwRiiCDDtm2d993am6XvB55arzcds1My7bV9O553TMq=w448-h796-no)

2. 直でツイート

![direct tweet](https://lh3.googleusercontent.com/at1jZ9ayA0sg5b3_D4bAiNn-IWOS2AGe9dTabTPzDwrfrmdeWJdgJPOk7CZJf6SPVO90eNO0eJlqxX6q2LqI1YsLygcVBSPsoWGtKlq88YrcEFrtkpJq0qsaXTs7Ub7uIBDCKqED0eZpkrLUCsFNl0I_xjZIlHmL6HA02bxKPvcwkWy65dvQEezcU6tFNw-J7r-PhSKeN50h4QT61g91E2Ov-GZE1XlZm64RqVgHfsLw-s6z8Pn9azQo-Ho9toUQx6SBKkkymBeoQ4uC_IoiOkyt5FO5Vje-qUkLyaQ8tPNpv0lr7fe3KPEiJqxaiTDm_m43yni3UxxrmMax9-ufIG83TkUEAKb-LlX-lYLrwFugyeeRbnjLuBomMuo6V4urXDQSYVhFINWgMwdaOMfeMRdXl8Fy_Hxw4SrY9w7qFT4ka4VwC3qczMx1A0DeTCnLS-d4iP9TXN93RnE_kPzRXAnzJgPgsue3oqh1us86cdMgIWIAzNAEUffIPFq2OllQdPk03Q7JQgCTMnCtmg_X2pnRbrQ2DdZZPco_L9ykHtJBArKpFcB-vpwzK4RhRYu83ZGTo5IkPjO6lEcBB3nKbS8dhAtLb_KQKNy_OWEc9KzKLf8b=w448-h796-no)

3. Android 7.0未満ではダイアログから

![from dialog](https://lh3.googleusercontent.com/2UsabktYkOXkuPfnibnpFQ_cGUJhJ8VNdMuKY4aXYi3bcBSfCDIpz73VHmD0fFvCsjKGOU9OKOo8_m_mMCJmYq-esRngM4aEbE4z5mPzwBMLPz6H779HE5cmL9C9BTW7x0U5S1M1IRgUF0Yum0eLATeoQcLoGBt_Wx7FN9BYTopLbtAe8k0c5XrnTqBbMe1aJE0FfokHkp-HLqhNmz3M5myE0ADBY2e3Snv-9Fcw2IwEgQGrooGLaUCXbndYeQ8STEqoanKrNTrP1MT7fdxzbVdNos8EqJyi4roS-WISbY4zmQ5hsYlIFpFXCKbJIcI0fqtAULxiqNBMpgnVFy06fhW0hJM17wILDa3T2Fp-Fdy7HsNyWClR4AIqvSIp884V4l6gnfjraBMDuxX5K-RwyHUMgoCuMhayr-pzkHGOX7ElfHcIxiducZWbg8fu0IPd5kDWjLpQz1gJA6_VdgApAIEmPZh_f3ctTjmuY6xuyC6tamtgqniY8OsBk0IbIgfaony_py0RRvff0Q99iyAb8ES6Z_j-ZUirL9LI2WjGFJE5caSlr5Dkyw69ueDXS7AkmUSTvbxwegOZeneJLdGeweZnY_SNmE5F6VksuzQi2uSEr8wk=w448-h796-no)


## モチベーション

- ひとりごとみたいにツイートすることが多いのでツイート特化型アプリがほしい
- 既存の通知エリアからツイートできるアプリは古くてメンテされてるか不明なものばかり
- 今風のかっこいいデザインのアプリがほしい
- Android NでDirect Reply(通知から直で返信できる機能)が追加  
  -> あれ、これ使えるんじゃ…？

という感じ。
  
要件は下記の通り

- 通知エリアからツイートできること
- 文字数超過したら編集できること

で、この他にお遊びみたいなものだけどいわゆる「連ツイ(in reply toでツイートをつなげる)」機能もつけてみました。

Direct Replyで用意されているのはカスタマイズができない入力エリアなので、文字数チェックは送信ボタンを押した後に行っていて、超過していた場合は編集用の画面が立ち上がる作りになっています。

今回はだいたいコーディングだけで102時間くらいかかったらしい(wakatime調べ)。

## アプリ名の由来？

"Monochrome"ではなく"Monologue"のmonoです。  
最初は"Monologue"で作ろうとしたけど案の定すでにTwitterに登録済みのアプリがありました…  
[Omnitweetyというアプリもリリースしてます](http://yslibrary.net/2015/11/10/omnitweety-andrid-released-share-url-twitter/)が、特に「Omni - Mono」で対になる、とか特に狙ったわけではないです。

# ※ここから下は技術者向け ----------

## 使ったライブラリとか

網羅的なものは[build.gradle](https://github.com/yshrsmz/monotweety/blob/master/app/build.gradle)見てもらうとして、主要なものを軽く紹介します。

### [Kotlin](http://kotlinlang.org)

最近流行りのアレ。  
拡張関数とかdata classとか、とても便利です。  
あとリスト操作関数が充実しててめちゃくちゃ捗ります。

### [Conductor](https://github.com/bluelinelabs/conductor)

Viewベースのアプリケーションを作るためのフレームワーク。  
数年前にSquareが[Fragment使わないぞ！って記事](https://medium.com/square-corner-blog/advocating-against-android-fragments-81fd0b462c97#.cf8ph0mnl)をだしていましたが、その流れのライブラリですね。

Fragment使いたくないけどどうすんの？って言われた時に候補としてまず挙がるのはSquare製の[Mortar](https://github.com/square/mortar)/[Flow](https://github.com/square/flow)だと思いますが、こちらのConductorはMortar/Flowよりもかなりシンプルな作りになっています。

Mortar/FlowはDaggerと一緒に使う前提で作られてるような感じで、SystemServiceにカスタムのServiceを追加したりいろいろ前準備が多くて「なるほどわからん」状態だったけれども、こちらは完全に"better fragment"にフォーカスしているような印象です。

DaggerだとかMVPだとかMVVMとかそういうのは開発者側で勝手にやってくれという方針なのでライブラリとして迷いどころは少なく、とても扱いやすかったです。なにより、サンプルが豊富で非常に助かりました。

ちなみにLollipop以上だったらちゃんと画面間のShared Element Transitionも行えます。

### [Dagger2](https://github.com/google/dagger)

とてもイケてるDIライブラリ。そういえば本家SquareのDagger1はdeprecatedになってましたね。  
今回のComponent構成はこんな感じ。

```
AppComponent ─ UserComponent ┬ SettingComponent
  │                          └ ComposeStatusComponent
  │
  └ ActivityComponent ┬ SplashComponent
                      └ LoginComponent
``` 

グローバルなAppComponentの下にユーザ毎に作られるUserComponentがあります。  
ユーザ情報が必要な各画面のComponentはUserComponentを親に持ちます。  
ユーザ情報が必要ない画面のComponentはActivityComponentを親に持ちます。

ここ、図の上ではSettingComponent/ComposeStatusComponentはActivityComponentに依存してないように見えますが、実はActivityComponentで管理されているインスタンスを、Componentに渡すModule経由で引き回してたりします。

これはActivityがUserComponentの作成より前(ログイン確認より前)に作られるのが原因です。  
Daggerでは複数のScoped Componentを親に持つことができないので、苦肉の策としてこのようにActivityComponentで管理されているインスタンスを渡す形にしました。  
うまいやり方があればいいのですが。

### [StorIO](https://github.com/pushtorefresh/storio)

SQLiteをリアクティブに扱うライブラリ。  
よりいろいろやってくれるSQLbrite、って感じでしょうか。  
Not ORM。

モデルとクエリの結果をマッピングするリゾルバクラスを生成するアノテーションプロセッサも用意されてますが、Kotlinはサポートされてないので手動で書く必要があります。

今回実はSQLite使う必要特になかったのですが、アーキテクチャのデモ的な側面もあったのでSQLite入れてます。  
GitHub上にAndroidアプリに様々なアーキテクチャ適用してみたよ系のデモレポジトリって結構あるのですが、だいたいAPI通信とメモリキャッシュまでで止まっててじゃあその先どう考えてるの？　って思うことが多かったので使ってみた次第。

ともあれ、StorIOはAPIもきれいでわかりやすいので、リアクティブに使えるSQLiteライブラリを探している方は試してみてはいかがでしょう。

## アーキテクチャ

前作のOmnitweetyでは、Android Clean Architectureを採用しました。ほとんど写経です。  
MonotweetyではAndroid Clean Architectureを踏襲しつつも諸々シンプルに再構成しています。  
たとえばDataSource周りのファクトリクラスを廃止してみたり、機能ごとのパッケージ構成にしてみたり。  
DataSourceの差し替えとか実際にアプリの実行中に発生することなんてほぼないので、まあ必要ないよねー、という判断です。  

あ、あとView周りに関してはMVPではなく、MVVMっぽいアーキテクチャとなっています。  
開発が佳境だった頃にKotlinのAndroid Studio PluginとDataBindingの相性が非常に悪かったので今回は地道にbinding処理書いてますが、Kotlin 1.0.5でだいぶ改善したらしいのでそのうち書きなおすのもやってみたい。


## アイコン

アイコンはOmnitweetyと同様、[99designs](https://99designs.jp/)を使っています。  
今回はコンペではなく、Omnitweetyのコンペの時に最後まで悩んで落としてしまったデザイナーさんにお願いしました。  
前回同様とてもかわいらしいアイコンが仕上がって満足しています。


こちらからは以上です。

参考: 

PlayStoreリンク: https://play.google.com/store/apps/details?id=net.yslibrary.monotweety  
GitHubリンク: https://github.com/yshrsmz/monotweety  
TwitterにURLを共有するAndroidアプリ、Omnitweetyを公開した: http://yslibrary.net/2015/11/10/omnitweety-andrid-released-share-url-twitter/
