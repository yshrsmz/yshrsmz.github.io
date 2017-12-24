---
layout: page
title: CQRSで単方向なデータの流れを実現しよう
tags:
  - android
  - kotlin
---

CQRS(Command Query Responsibility Segregation: コマンドクエリ責務分離)は、更新系の処理(Command)と参照系の処理(Query)を分ける実装パターンです。

イベントバスを使って更新完了を通知し、受信側が新しいデータをPullするパターンと、更新が完了すると予め変更通知を購読している場所にdata層から新しいデータが降ってくるパターンがあります。

最近のAndroidにはRxJavaというデータをリアクティブに扱うための強力なツールがあり、またRealmやRoom、OrmaやStorIOといったようなデータベースをリアクティブに扱うことのできるライブラリがたくさん存在します。

こういったツールを使いCQRSを実装するだけでも、FluxやMVIといったアーキテクチャパターンがそのメリットとして挙げている「Unidirectional Data Flow(単方向なデータの流れ)」を実現することができます。

## CQRSするメリット

- 状態の予測しやすさ
- シンプルなコード

### 状態の予測しやすさ

さて、これはCQRSというかコードを書く際の心がけという面もありますが…  
実際に２つの擬似コードを見てもらいましょう。  
あるSNSアプリの、ユーザ詳細を表示するActivityの一部です。  
初期表示と、そのユーザをお気に入り登録したときの挙動が書いてあると思ってください。

CQRSしない版
```kotlin
val userId by lazy { intent.getString("user_id") }

lateinit var user: User

override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)
  // 色々初期化処理する

  // ユーザ情報の取得と初回描画
  userRepository.getUser(userId)  // Single
    .subscribe { newUser -> 
      user = newUser
      updateUI(user) 
    }
}

// お気に入り登録
fun onFavoriteClick(){
  userRepository.doFavorite(userId)   // Completable
    .subscribe { 
      user.isFavorite = true
      updateUI(newUser)
    }
}

fun updateUI(user:User) {
  // UIの更新処理
}
```

CQRSする版
```kotlin
val userId by lazy { intent.getString("user_id") }

override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)
  // 色々初期化処理する

  // ユーザ情報の購読
  userRepository.observeUser(userId)  // Flowable
    .subscribe { newUser -> updateUI(newUser) }
}

fun onFavoriteClick() {
  userRepository.doFavorite(userId).subscribe() // Completable
}

fun updateUI(user:User) {
  // UIの更新処理
}
```




### シンプルなコード

実際に２つの擬似コードを見てもらいましょう。  
あるSNSアプリの、ユーザ詳細を表示するActivityの一部です。  
初期表示と、そのユーザをお気に入り登録したときの挙動が書いてあると思ってください。

CQRSしない版
```kotlin
val userId by lazy { intent.getString("user_id") }

override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)
  // 色々初期化処理する

  // ユーザ情報の取得と初回描画
  userRepository.getUser(userId)  // Single
    .subscribe { newUser -> updateUI(newUser) }
}

// お気に入り登録
fun onFavoriteClick(){
  userRepository.doFavorite(userId)   // Completable
    .andThen { userRepository.getUser(userId) } // Single
    .subscribe { newUser -> updateUI(newUser) }
}

fun updateUI(user:User) {
  // UIの更新処理
}
```

CQRSする版
```kotlin
val userId by lazy { intent.getString("user_id") }

override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)
  // 色々初期化処理する

  // ユーザ情報の購読
  userRepository.observeUser(userId)  // Flowable
    .subscribe { newUser -> updateUI(newUser) }
}

fun onFavoriteClick() {
  userRepository.doFavorite(userId).subscribe() // Completable
}

fun updateUI(user:User) {
  // UIの更新処理
}
```

いかがでしょう。２つとも大体同じ動きをするコードです。

CQRSしない版のコードでは、ユーザ情報の取得処理が複数の場所に書かれていますが、CQRS版では`onCreate`内で一度記述があるのみです。  
一方CQRS版の方では、`UserRepository#observeUser(userId:String):Flowable<User>`が指定したidの`User`に変更があるたびに通知してくれるので、いちいち`onFavoriteClick`内で`User`を取得し直す必要がありません。  
このように、参照系と更新系の処理を分け、コードをシンプルにすることができます。



## なぜデータの流れを単方向にしたいのか？

`Unidirectional Data Flow`と反対の概念は`Bidirectional Data Flow`とか、あるいは`Two-way DataBinding`です。

`Action -> Dispatcher -> Store -> View`

`Command -> Repository -> Query -> View`
