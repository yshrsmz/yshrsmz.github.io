---
layout: page
title: 趣味アプリをMVPからMVVMに書き換えて更にKotlin化した話
tags:
  - android
  - kotlin
---

[Android Advent Calendar 2017](https://qiita.com/advent-calendar/2017/android)の24日目です。

　2年ほど前(2015年)に個人で作ったAndroidアプリを、ふと思い立って完全リファクタリングすることにしました。
理由はいくつかあるけれど、主なところでは下記の四点でした。

- Kotlinの流れがきている
- Android CleanArchitectureを踏襲してみたけど…
- 最近はMVPよりMVVMが好き


### Kotlinの流れが来ている

　[去年(2016年)につくったアプリ](https://github.com/yshrsmz/monotweety)はKotlinで書いていて、Kotlinがどういったものかとかその便利さはもともと知っていました。  
 最近では業務のアプリも新規のコードはKotlinで書いていたし、なにより今年のGoogle I/OではAndroidでのKotlin公式サポートが追加されました。apkのサイズが増えるとかはあるけど、今更Javaに固執する必要もないなあ、という感じ。
 
 ### Android CleanArchitectureを踏襲してみたけど…
 
 [Android CleanArchitecture](https://github.com/android10/Android-CleanArchitecture)を写経するくらいの感じで作ったけれど、今見返してみると色々と気になる点がいくつかありました。

例えばdata層の`DataStoreFactory`。本家の実装ではこの`DataStoreFactory`でローカルデータの存在判定をして実際に使う`DataStore`を切り替えたりしています。でも、RxJavaだったら`merge`オペレータとかでこの「キャッシュの存在判定してなかったらサーバに問い合わせ」的なコードはシュッと書けるのでファクトリクラスはなくてもいいかなー、という気持ちが強くなっていた。

あと、本家の実装では画面回転時のViewの状態保持、各画面Fragmentを`retainInstance = true`にすることで実現していました。これ実装当時も気持ち悪いなーって思いながら踏襲してたけど、ちょうどGoogle I/O 2017でArchitecture Componentsが発表されたので、これの`ViewModel`を使ってよりスマートに解決することに。

### 最近はMVPよりMVVMが好み

　これは完全に好みの問題な気もするけど、最近はDataBindingもあるしMVVMっぽいView/Presentation層の作り方が好きだ。

　MVPのどこが肌に合わなかったかというと、「interfaceとはいえPresenterがViewのことを知っているので、Viewのライフサイクルに合わせなければならない箇所がある」という点だ。Androidは画面回転が発生するとActivityやFragmentが再生成されるし、`onStop`以降で画面をいじるとアレなことになる。なので、画面回転をこえて状態を保持するPresenterを作ろうと思ったらどうしても`Presenter#takeView(View)`とか`Presenter#dropView()`みたいなメソッドを作ることになるし、`Presenter`内では`View`がnullかどうかチェックして回る必要がある。
 
 Presenterのライフサイクル自体はViewのそれに合わせてしまって、状態を別の場所(例えばArchitecture ComponentsのViewModelとか)に移してしまえばこの問題も解決できるかなー、という気もするけど、まだそこまでは試していない。

その点MVVM的な作りにするとViewModelはViewへの依存を持たないので、単純にViewModelの公開するイベントをViewが購読するだけだ。ViewModelはひたすら状態を更新し続けるだけで、View側でライフサイクルに合わせてどうとでもできる。

---

そんな感じで色々考えた結果、Kotlin化とアーキテクチャの改善で大体こんな感じ

![resule_diff](/assets/img/posts/201712/refactor_diff.png)

Javaで16,000行ちょいあったのが6,000行ほど削減されました。

改善後のアーキテクチャは大体こんな感じ

![diagram](/assets/img/posts/201712/reactive_mvvm.png)

実際に実施した内容は下記のような感じ

- Kotlinに完全書き換え
- パッケージ構成をアプリの機能毎に変更
- data層は`Repository`が`DataStore`に直接依存する
- CQRSを取り入れる
- MVPからMVVMへ
- 使っていたライブラリを幾つかKotlinの機能で置き換え

### パッケージ構成

Before

```
├── data
│     ├── cache
│     ├── entity
│     ├── net
│     └── repository
├── domain
│     ├── interactor
│     └── repository
├── presentation
│     ├── navigation
│     ├── presenter
│     ├── view
│     │    ├── activity
│     │    ├── fragment
```

After
```
├── data
│     ├── user
│          ├── disk
│          │     └── UserDiskDataStore
│          ├── cloud
│          │     └── UserCloudDataStore
│          ├── User
│          └── UserRepository
├── user
│     ├── domain
│     │    ├── ObserveUser
│     │    └── DoFavoriteUser
│     ├── UserActivity
│     ├── UserViewModel
```

Beforeが若干雑で申し訳ないけども、つまりアプリの機能に沿ってパッケージ分割するように変更した、ということです。

一つの機能(画面)で使うクラスが大体同じパッケージにまとまるので、個人的にはだいぶ見通しがよくなりました。


### CQRS
CQRS(Command Query Responsibility Segregation: コマンドクエリ責務分離)は、更新系の処理(Command)と参照系の処理(Query)を分ける実装パターン。

イベントバスを使って更新完了を通知し受信側がPullするパターンと、更新が完了すると予め変更通知を購読している場所にdata層から新しいデータが降ってくるパターンがあります。

今回のアプリではRxJavaとRealmを使っているので、後者の勝手に新しいデータが通知されるパターンで実装してみている。  
最近のAndroid界隈はRealmとかRoomとかOrmaとか、DBをリアクティブに扱えるライブラリが増えてきているので、データをリアクティブに扱うのはだいぶ楽になってるなー、と感じる。

下に示すのは、SNSアプリのユーザ詳細画面の擬似コードです。画面の初回表示と、いいねボタンをおした時あたりのコードが書かれている。

普通に書いた時
```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)
  // 色々初期化処理する

  userRepository.getUser(userId)  // Single
    .subscribe { newUser -> updateUI(newUser) }
}

fun onFavoriteClick(){
  userRepository.doFavorite(userId)   // Completable
    .andThen { userRepository.getUser(userId) } // Single
    .subscribe { newUser -> updateUI(newUser) }
}

fun updateUI(user:User) {
  // UIの更新処理
}
```
このように変更通知のない世界では、状態を変更した後には自ら新しい状態を取得しにいかなければなりません。  
そうすると、いろいろな場所で状態の取得をすることになり、コードが膨れ上がりがちです。

CQRS適用後
```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)
  // 色々初期化処理する

  userRepository.observeUser(userId)  // Flowable
    .subscribe { newUser -> updateUI(newUser) }
}

fun onLikeClick() {
  userRepository.doLike(userId).subscribe() // Completable
}

fun updateUI(user:User) {
  // UIの更新処理
}
```
さて、CQRSを適用すると
