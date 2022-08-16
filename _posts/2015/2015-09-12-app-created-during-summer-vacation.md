---
layout: post
title: (Android) 夏休みだったので画像を検索してひたすらファボるAndroid用Twitterアプリつくった
category: programming
tags:
  - Android
---
 
掲題のとおり、Androidアプリを作った。
最初はまったく別の事情のために作り始めたのだけれども、途中でその用事がなかったことになったのでそのまま「夏休みの課題」として仕上げることにした。

名前は「画像検索してファボるやつ」  
まずはデモ動画をどうぞ。

<iframe width="420" height="315" src="https://www.youtube.com/embed/vAbFlXz8vQQ" frameborder="0" allowfullscreen></iframe>


見ての通り、設定したキーワードでTwitter検索して、結果をタブ形式で表示するだけのアプリです。アプリからできるアクションはお気に入りだけ。

アプリを作るにあたって設定した要件は下記の通り

- 画像投稿サービスのAPIを使ったアプリであること
- 二日間くらいで仕上げること


というわけで、

- TwitterのAPIを利用して画像を検索、
- 検索結果をタブで表示し、スワイプで移動でき
- ひたすらファボれる

アプリを作ることにした。

最初はInstagramで作ろうとしたんだけど（ `#ilovecat` をひたすら見るだけのアプリを作りたかった）、ちょっとAPIドキュメントを見た限りだとLikeのAPIが一般には公開されていないようだった。
そこで、同じように画像が投稿されていてハッシュタグが使用されているTwitterのAPIを利用することにした。

そしてできあがったのがこの、「画像検索してファボるやつ」だ。  
レポジトリは[こちら](https://github.com/yshrsmz/photosearcher)。

## 技術的な

使った技術はだいたい下記の通り。

- dagger2
- Fabric Twitter Kit
- RxAndroid
- Realm

### Dagger 2

言わずと知れたDIライブラリ。  
モデルクラスの注入とかいろいろ。
Singletonの管理もさくっとできるので、今回は特に各タブ表示用の `List<Tweet>` の管理クラスを運用するのにとても役立った。  
Fragmentが状態をあまり持たなくなったので、結果的に画面のローテーションにも対応できたようだ。


### Fabric Twitter Kit

Twitter周りの処理はまじめにやっていたら２日では仕上がらない気がしていたので、完全にFabricに頼ってしまうことにした。

Fabricはホントにすごくて、認証はボタンをひとつ置くだけだし、基本的なAPIアクセスも数行のコードだけで実現できてしまう。

自分でAPI周りの処理を書きたい時のためにリクエストヘッダに付加する情報も簡単にアクセスできるよう準備してあるし、もう至れり尽くせりである。

小洒落たことをしようと思わなければ、「自分のアプリ内で関連ツイートを表示」みたいな要件はさくっと満たせてしまう。
軽くTwitterアプリ作ってみたいなー、という諸兄はぜひ一度Fabricを使ってみてはいかがだろうか。

ただ、実はFabricのTwitterSDKはRecyclerViewに対応していなかったりRxJavaをサポートしてなかったりしたので、ListView用のクラスを参考にしつつRecyclerView用のクラスを書いたり、Timelineクラスをリアクティブに扱うためのクラスを自作したりすることになった。

このへん、おそらくサードパーティの開発者が使うことを想定してないであろうクラスを直でつかったりしてるのでSDKの仕様変更があったら大変なことになりそう。



### RxAndroid

Fabric Twitter SDKはそのままだと普通のコールバック形式のAPIなので、RxJavaでリアクティブに扱えるように[ラッパークラス](https://github.com/yshrsmz/photosearcher/blob/master/app/src/main/java/net/yslibrary/photosearcher/model/rx/TimelineObservable.java)を用意してみた。  
最初は `Observable<List<Tweet>>` にしていたんだけど、 最終的に取得した `Tweet` オブジェクトをTimelineのラッパークラスでまとめて管理するようにし、かつ `Adapter` クラスでもそのTimelineのラッパークラスを直接見るようにしたので、 `Observable` では新しい`Tweet` オブジェクトを「どの位置にいくつ追加したか」を通知するだけにした(通知先では `Adapter#notifyItemRangeInserted` を呼ぶだけ)。

あとは、SDKの提供するお気に入り追加APIがRetrofit使ってるにも関わらずコールバック形式だったので `Observable` を戻り値にするAPIを用意してみたり。こういう拡張の余地を残しといてくれるの、とても使いやすくてよい。


### Realm

Search API経由だと、自分がそのTweetをお気に入り済みかどうかわからない、というAPIの制約があるので、このアプリからふぁぼったかどうか、を保存している。

あとは、入力したキーワードの保存。



## アーキテクチャについて

最初は `Mortar/Flow` 使ってMVPだ！　とも思っていたんだけど、「２日くらいでつくれるやつ」という制約があったので何度か作ったことのあるActivity/Fragmentを使ったベーシックな構成にしている。  
機会があったらMVPで作りなおしてみよう。

パッケージ構成は以下のとおり

```
net.yslibrary.photosearcher
    ├── event               // Ottoのイベントクラス
    ├── graph               // DaggerのComponentとかModuleとかアノテーションとか
    │   ├── component
    │   ├── module
    │   └── qualifier
    ├── model               // モデルクラス類
    │   ├── api             // RetrofitのAPI interfaceとか
    │   ├── dto             // アプリで使う永続しないPOJO
    │   ├── entity          // RealmObjectを継承したデータベースエンティティ
    │   ├── enums           // enum
    │   ├── helper          // ヘルパーパッケージ(正直Utilパッケージと区別ない)
    │   └── rx              // 独自Observable/Operatorクラス類
    ├── ui
    │   ├── activity        // Activity
    │   ├── adapter         // RecyclerView/ViewPagerのアダプタ類
    │   │   └── decoration  // RecyclerViewのItemDecorationクラス
    │   ├── fragment        // Fragment
    │   ├── listener        // Activity/Fragmentのリスナinterface
    │   └── view            // Custom View
    └── util                // Utility
```

## 総括

二日間の目標で走り始めたけど、結局三日間くらいかかってしまった(Wakatime調べ)。  
でも、Fabric Twitter KitとかAndroid Design Support LibraryとかRecyclerViewのItemTouchHelperとか、新しい知見も結構得られたのでとても良かったと思う。  
小さな課題を設定して短期間でアプリを作るの、結構身になるようなので今後もやっていこう。

## 今後

[Twitterの表示要件](https://about.twitter.com/ja/company/display-requirements)に沿ってないので、特にGoogle Play Storeで公開することは考えてない。  
欲しい機能があったら追加していくくらいの感覚。

## Open Source!
[Github](https://github.com/yshrsmz/photosearcher)で公開してるので、お好きに見ていただけたらいいと思います。

