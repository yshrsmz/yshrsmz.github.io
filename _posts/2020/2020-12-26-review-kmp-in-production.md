---
layout: post
title: Kotlin Multiplatform Projectを導入してみて
category: programming
tags:
  - kotlin
  - kmp
---

本記事は[Android Advent Calendar 2020](https://qiita.com/advent-calendar/2020/android)の24日目です。

この記事は某勉強会で発表したもののトランスクリプト＋αです。

実際に仕事のAndroidアプリでKotlin Multiplatform Project(以後KMP)を導入してみてどんな感じだったか、というのをまとめていきます。

## 前提

- チーム構成: Android、iOS、デザイナー、バックエンド、各一人ずつ
- API: GraphQL
- 参照系がメインのシンプルなアプリ


## コード割合

![](https://lh3.googleusercontent.com/pw/ACtC-3fwBbQWoRzuihsoRs_IcPmqPuavNS4U0zCf0bPu_NVFv0iHFm9-taKVmMeVYJrYtyKjZzwBGU4LRZp8cDxnnkmihNnjnP9hW3pyh2XjGLgJMDNHDdgAq51tpCBXYz1vmF1uK_k06bQVNBlDeHKRvutCbQ=w616-h314-no?authuser=0)

GitHubのコード割合的にはこんな感じです。Kotlinが48%。
ただこれだとノイズが多いので、もう少しシンプルにしてみましょう。

まず、Objective-CとJavaは古の社内ライブラリなので除外します。  
その他、レイアウトファイルやら設定ファイルやら諸々も除外して、純粋にKotlinとSwiftの行数のみで比較してみます。  
そうすると、こんな感じになります。

| 区分 | 割合 |
|---|---|
| KMP | 68% |
| Android(Kotlin) | 16% |
| iOS(Swift) | 16% |

全体のおよそ7割がKotlinで書かれた共通コードです。  
この数字はiOS/Android合わせた全体に対しての比率なので、各OS毎で計算すると8割近くが共通コードとなっています。

## アーキテクチャ

### レポジトリ構成

レポジトリ構成はモノレポを採用しています。KMP, Android, iOSすべてのコードを一つのレポジトリで管理している、ということです。

モノレポを採用している理由はいくつかあるのですが、一番大きいのは「共通コードの読み込みが簡単」というものです。

モノレポじゃない選択肢としてKMP, Android, iOSをそれぞれ別個のレポジトリで管理する、というものも考えられます。  
しかし、その場合だとKMPの成果物を各OSのレポジトリから使用する際にひと手間必要になってきます。

git submoduleで読み込むのか

privateなMaven RepositoryやCocoaPods Repositoryを作るのか

あるいはsymlinkか…？

などなど。  
モノレポであればこういったことに悩む必要はありません。  

今回のプロジェクトではAndroid/iOS間でのコード共有だけだったのでこの方針にしましたが、サーバサイドとのコード共有もしたい、とか要件が複雑になってきたらレポジトリの分割を検討してもいいと思います。

```
.
├── android-features
│   ├── common
│   └── debugmenu
├── androidApp
├── core
│   ├── base
│   ├── di
│   ├── model
│   └── semver
├── data
│   ├── graphql-api
│   ├── graphql-document
│   ├── local
│   ├── remote
│   └── repository
├── domain
├── features
│   ├── domain
│   └── presentation
├── iosApp
├── presentation
│   ├── analytics
│   ├── auth
│   ├── build
│   ├── error
│   ├── message
│   ├── presentation-all
│   ├── presentation-base
│   └── servicestatus
└── testing
    ├── annotation
    └── mpp-test
```

ディレクトリ構成はおおよそこんな感じです。  
`android-features`, `androidApp`, `iosApp`以外がKMPのモジュールです。

モノレポにした副次的なメリットとして、自分の直接担当してないOSのコードへのオーナーシップが生まれる、というのがありました。  
iOSの人が共通コードを書く際はKMPのコードとiOS側のコードが含まれるPRを作るわけで、そうすると自然とiOSのコードも読むようになります。次第にiOS側のコードに対する提案とか、もっと言うとKMPのコードに対応するAndroid/iOSのコードを両方とも一人で書いてしまう、ということも相互に発生するようになってきました。

### CI

CIはbitriseを採用しています。設定は特に凝ったことをする必要はなくて、一つのレポジトリに対してAndroidとiOSのCI設定をそれぞれ行うだけです。

PRが作られたりコミットがpushされると、AndroidとiOSのビルドが同時並行で走ります。
iOS向けのビルドではKotlin/Nativeのテストを行い、Android向けのビルドではKotlin/JVMのテストを行います。

iOSのビルドはどうしても時間がかかってしまうので、ktlintなど共通コード向けのLintはより軽量なAndroidのCIで実施しています。

### KMPコードのアーキテクチャ

全体的にはレイヤードアーキテクチャを採用しています。

```
+-----------+
| ViewModel |
+-----------+
    |  |
    |  +----------+
    V             V
+---------+   +---------+
| UseCase |   | UseCase |
+---------+   +---------+
    | |               |
    | +------------+  |
    V              V  V
+------------+   +------------+
| Repository |   | Repository |
+------------+   +------------+
    |  |                    |
    |  +---------------+    +-----...
    V                  V
+------------+   +-----------+
| RemoteData |   | LocalData |
+------------+   +-----------+
```
 
クラスの依存グラフはおおよそこんな感じになっています。レイヤードアーキテクチャのよくある構成になっているのではないかと思います。

プレゼンテーション層から下はすべてKMPで書かれた共通コードです。  
逆に言うと、OS固有のコードは基本的にActivityとかViewControllerとか、View層のものだけになっています。

データ層のみKMPで共通化、とか色々共通化の度合いに選択肢はあったのですが、せっかくの新規アプリなので「KMPでどこまでできるのか」を確かめる意味合いも含めてこのような決断をしました。

色々難しい点もありましたが、共通コードの割合も前述の通りかなりいい線いってますし、結果的に良かったのではないかと考えています。


### ViewModelのインターフェイス

さて、プレゼンテーション層より下はすべて共通コード、としたことで各OS側から意識する必要のあるKMPのコードは基本的にViewModelだけにすることができました。

ではViewModelは一体どんなインターフェイスになっているのでしょうか。

```kotlin
// MviViewModelはAndroid側ではandroidxのViewModelを継承している
abstract class MviViewModel<INTENT, ACTION, STATE, EFFECT> : ViewModel() {
    val state: STATE
    val states: Flow<STATE>
    val effects: Flow<Event<EFFECT>>
    val dispatch(intent: INTENT)
    fun onCleared()
}
```

擬似コードですが、ざっくり上記がViewModelのインターフェイスです。

今回のアプリではプレゼンテーション層のデザインパターンとしてMVI(Model-View-Intent)を採用しています。  
MVIについての詳細な説明は他の詳しい記事に譲りますが、下記のような特徴があります。

- 単方向データフロー
- ImmutableなState

誤解を承知で大変ざっくり言ってしまうと、画面毎にReduxをする、というのが結構近い表現なのかなと思います。

よく見かけるMVIのパターンに追加して、今回のアプリでは `Effect` というものを追加しています。  
これはToastやDialogの表示、あるいは画面遷移イベントなど、一時的なイベントをViewに通知するための仕組みです。  
こういったイベント類をStateに含んでしまうと管理が複雑になってしまいがちなので、別物として扱っています。

上記のコードを見ていただくと、`Effect`は`Event`というクラスでラップされています。この`Event`クラスは、Android界隈でよく話題になる、[`SingleLiveEvent`問題に対応するためのクラス](https://medium.com/androiddevelopers/livedata-with-snackbar-navigation-and-other-events-the-singleliveevent-case-ac2622673150)です。

最近はStateFlowやSharedFlowが追加されこの辺の問題にも新たなアプローチが追加されそうですが、Flowを使っているからといってこの問題が100%解決できるわけではありません。そのため、本アプリでは今のところ`Event`ラッパーを利用して同じイベントが再通知されることを防いでいます。

全体的な処理の流れは下記のようになります。

1. Viewから`dispatch`メソッドを通じてイベント(Intent)がViewModelに通知される
2. ViewModelは通知されたイベントをもとに対応する処理を行い、新しいStateやEffectをFlowに流す
3. Viewは購読しているStateやEffectのFlowから新しいState/Effectを受け取り、状態を更新する

#### iOSからの使い方

ViewModelのインターフェイスについて解説しましたが、ViewModelからの出力はkotlinx.coroutinesのFlowになっています。  
このFlow、iOSからはそのまま使うことができません。

そのため、下記のようなラッパークラスを用意してあげる必要があります。

```kotlin
class ViewModelAdapter<Intent, STATE, EFFECT>(
    private val viewModel: MviViewModel<INTENT, *, STATE, EFFECT>,
    private val coroutineContext: CoroutineContext
): CoroutineScope {
    override val coroutineContext = ...
    fun dispatch(intent: INTENT)
    fun onStateChanged(callback: (state: STATE) -> Unit) {
        launch {
            viewModel.states
              .onEach { state -> callback(state) }
              .collect()
        }
    }
    fun onEffectReceived(callback: (effect: EFFECT) -> Unit)
    fun onCleared()
}
```

とまあこんな感じです。

### 共通化できないコードを共通コードで使う

各OS向けのライブラリとかOS固有の機能を共通側から使いたい場合もあります。  
たとえばFirebaseAnalyticsなどです。

こういった場合には下記の二種類の方法が考えられます。

- expect/actualを使う
- interfaceをKMP側で定義し、各プラットフォームで実装クラスを用意

どちらでも要件は達成できますが、テスト時にモックと入れ替えたりすることを考えるとinterfaceで用意するほうが楽です。  
[公式でもexpect/actualの利用は最小限に留めるよう推奨されている](https://kotlinlang.org/docs/reference/mpp-connect-to-apis.html)ので、本アプリでもそのようにしています。


### 利用しているKMPのライブラリ

| ジャンル | ライブラリ |
|---|---|
| DI | Kodein |
| 非同期/並列処理 | kotlinx.coroutines, CoroutineWorker, Stately |
| 通信 | Ktor, kgql(GraphQL), kotlinx.serialization |
| ローカルキャッシュ | sqldelight, multiplatform-settings |
| 環境変数的なの | BuildKonfig |
| ログ | Napier |

## KMPのメリット

### 使い慣れた言語で書ける

Androidエンジニアから見たらこれがかなり大きいでしょう。  
iOSエンジニアからすると、新言語という意味では他のクロスプラットフォームソリューションと大差ないかもしれません。SwiftとKotlinは似ているとよく言われますが、実際どうなんでしょうね。

### 工数削減

本アプリでのケースではViewModel以下がすべて共通です。そのため、Android/iOSそれぞれ別で作っている場合と比べると、ViewModel以下の作成にかける工数が単純計算で半分ですみます(個人の感想です。実際の効果を保証するものではありません)。

自分がAndroidのViewを書いている間にiOSの人が別画面のViewModelを作っていて、AndroidのViewが書き終わったと思ったらAndroid担当は自分しかいないのに次の画面のViewModelがもう完成している、ということが実際にありました。

同じコードを共有するわけですからViewのコードも似通ったものになります。相互にコードを参考にしあったり実装の相談をしたり、ということもしやすいです。

### 用語/仕様に差が生まれない

プレゼンテーション層が共通ですから、必然的に用語も同じになります。  
たとえばユーザのプロフィール画面がiOSでは`AccountViewController`でAndroidでは`ProfileFragment`、とか言うことは起きないわけです。ViewModelの名前が`AccountViewModel`だったら両OSともにそれに沿った名前になります。

ビジネス的に重要な部分も共通にできるので、入力フォームのバリデーションロジックがプラットフォームで異なるとか、ログの値や名称がプラットフォームで異なる、とかいう事態も回避することができます。

アプリ開発であるあるな「え、こんな機能あったんですか、Androidでは実装してないです…」も、共通部分のコードはAndroid/iOS両方のエンジニアがレビューしているはず、という前提に立てば基本的に発生しないはずです。


### Viewを各プラットフォームで書ける

これは考え方によるかもしれませんが、KMPでは基本的にViewを各プラットフォームで書くことになります。  
そのため、各OSの特性やデザインガイドラインを意識したUIを最適な方法で作ることができます。最新OSの機能も自由に使えるはずです。

KMPでもViewを共通化したい、という場合は現状すぐれた選択肢はないのですが、将来的にはJetpack Compose(というかJetBrains版のComposeというか)が対応するかもしれません


### 導入する範囲を選べる

これも他のクロスプラットフォームソリューションと比べたときのメリットになると思います。

本アプリではできるだけたくさんのコードを共通化することを目標に開発していましたが、もちろんプロジェクトのニーズに応じて導入する範囲を選ぶことも可能です。  
たとえばリモートAPIクライアントだけKMPで書いてAndroid/iOS/Webフロントエンドで共有したい、とか。

KMPの成果物は、Androidからはjarやaar、iOSからはframework、JavaScriptからはnpmパッケージというように、各プラットフォームで自然に利用できる形で出力されます。  
使う側のコードでは特に込み入った設定は必要ないので、既存のプロジェクトでも比較的導入しやすいのではないかな、と思います。

## KMPのデメリット

### 学習コスト

デメリットという観点だと学習コストが一覧大きいでしょう。

まずiOSの人にKotlinを学んでもらう必要があります。

Androidエンジニアも、Kotlin普段遣いしているから楽勝、とはいきません。

Kotlin/Nativeには、マルチスレッド周りの挙動を中心に色々とKotlin/JVMとは異なる仕様がいくつかあります。  
Androidの感覚で並列処理を書いてしまうと、iOSでクラッシュするコードになってしまうことが多々あります。  
この特性を理解し、iOS(Kotlin/Native)で動くことをテスト等で確認しながら開発を進めていく必要があります。ちなみにiOSでちゃんと動けば基本的にAndroidでもちゃんと動きます。

日本語の資料がまだ少ない、というのも人によっては障害になるでしょう。  
英語の資料はそこそこありますし、Kotlin公式Slackでは活発にやり取りが行われているので、英語でのコミュケーションができれば必要な知識はだいたい揃います。  
GitHub/YouTrackのissueを読むのも色々な不具合をしらべる有効な手立てです。

### KMPはまだα版

NetflixやDropboxをはじめ、本番環境に導入している企業が多いので忘れてしまいがちですが、KMPはまだα版です。  
破壊的変更もしばしばあります。


最近だと、Kotlin 1.4.0に対応するKtorのリリースで、いきなりマルチスレッド対応版のkotlinx.coroutiensが必須になったことは記憶に新しいです。

将来的にKotlin/Nativeのメモリ管理モデルが完全にリプレースされることが予告されている点も、α版感あふれる事項です。

「なにもしてないのにIDEが真っ赤になった、よくわからないけど色々なキャッシュを全削除したら直った」みたいなこともたまに、普通のAndroid開発よりは高い頻度で発生します。

ライブラリも、ファイル操作周りをはじめ、まだ基本的なものが揃っていなかったりします。  
まあこれは考え方によってはチャンスでもあります。  
競合が少ないので、自分で作ったライブラリがコミュニティのデファクト・スタンダードになれる可能性も比較的高いです。


## まとめ

### KMPを使ってよかったか

これはYESと言い切れます。

コードの共通化を無理なく、使いやすい言語で実現することができ、工数の削減も叶いました。

既存のプロジェクトへの導入も容易ですし、ビジネスロジックのみ共有したい、という要件の場合には有効な選択肢になりうると考えています。


### KMPをおすすめできるか

この観点では、条件付きのYESになります。

KMPの学習コストは決して低くはないです。  
日本語の資料もまだ少ないですし、ある程度自分で調べる力が必要です。

フレームワーク側の実装を読んだり、GitHubやYouTrackのissueを調べたり。あるいは英語の文献を読んだりKotlin Slackをはじめとした英語のコミュニティで発言をしたり。

KMPが安定してくるに従って改善していくでしょうが、現状はある程度エンジニアとしての地力が求められる環境である、と言えるでしょう。

経験の浅い人が多いチームで、しかしそれでもクロスプラットフォームで開発したい、という場合もあるかと思います。  
そういった場合は、KMPではなくFlutterを選んだほうがいいかもしれません。

Flutterのほうが日本人のコミュニティが大きいですし、Viewまで共通で書けるため、各プラットフォームの知識はKMPほど必要ありません。

あるいはクロスプラットフォームを選択したい、という方針と真っ向から対立してしまいますが、素直にAndroid版とiOS版を個別で実装して経験を積む、という選択肢を検討してみるのもアリだと思います。  
FlutterにしてもKMPにしても各OSの仕様を知らないと解決できない問題が存在します。要件が複雑になればなるほどそういったケースは増えてくるので、各OSの知見がチーム内に少ない状態でクロスプラットフォームを選択してしまうと、結果的に工数が増えてしまう可能性があります。

---

以上です。

なんだかんだ色々書きましたが、私は日々KMPで開発してて大変楽しいです。
