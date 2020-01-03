---
layout: post
title: (Android) Architecture ComponentsのViewModelは如何にしてRotationを生き残るか
category: programming
tags:
  - android
  - java
---

## TL;DL;

`retainInstance = true`なFragmentにキャッシュされているので、Activity/Fragmentが本当に殺されるまで生き残ることができる。

---

Google I/O 2017で、[`Architecture Components`](https://developer.android.com/topic/libraries/architecture/index.html) という新しいライブラリ群が発表されました。

`LiveData`, `ViewModel`, `LifecycleObserver`, `LifecycleOwner`, `Room`といったこれらのライブラリは、開発者がより強固で、テスタブルで、かつメンテナンス性が高いアプリケーションを作るための手助けとなるべく作られています。

今回はその中でも`ViewModel`について少し調べてみました。


## What is ViewModel?

詳しい説明は[`ViewModel`のリファレンス](https://developer.android.com/topic/libraries/architecture/viewmodel.html)に譲りますが、簡単に言うと「Activity/Fragmentのローテーション等による再生成をこえて状態を保持するためのコンポーネント」です。

今までActivity/Fragmentのメンバ変数に保存していたような値や非同期処理を`ViewModel`に書いておけば、Activity/Fragmentが再生成されたとしても値や非同期処理の状態が維持されてそのまま使えます。

`onSavedInstanceState`でいちいち`Bundle`に詰め込んだりしなくてすみます。
私自身はあまり使ったことがありませんが、`AsyncTask`等をいちいち書く必要がなくなります。

でも、どうやって？


## How does ViewModel retain itself?

※これはGoogle I/O 2017で発表された1.0.0-alpha1時点での話です

`ViewModel`は下記のような感じで取得します。使う側のActivity/Fragmentではキャッシュから取得するとか新規作成するとか、そういうことを意識する必要はありません。

```java
FooViewModel viewModel = ViewModelProviders.of(fragment).get(FooViewModel.class);
```

`ViewModelProviders#of`にはActivityかFragmentを渡すことができます。一つ注意することがあって、Fragmentを渡すときは`fragment.getActivity() != null`でなければならず、detachされているFragmentでは使うことができません。

`ViewModelProviders#of`はActivity/Fragmentのみを引数に取るものと、Activity/Fragmentに加えて`ViewModel`のファクトリクラスを引数に取るものがあります。

ファクトリクラスを渡さない場合は引数なしのコンストラクタを呼び出して`ViewModel`をインスタンス化するようです。

また、`ViewModel`の代わりに`AndroidViewModel`というinterfaceを実装すると引数が`Application`のコンストラクタを使う模様です。

Dagger等のDIライブラリを使う場合はファクトリクラスを使うことになりそうです。

さて、`ViewModelProvider`はこんな感じでインスタンス化されています。

```java
// ViewModelProviders.java
public static ViewModelProvider of(@NonNull Fragment fragment) {
    FragmentActivity activity = fragment.getActivity();
    if (activity != null) {
        throw new IllegalArgumentException("Can't create ViewModelProvider for detached fragment");
    } else {
        initializeFactoryIfNeeded(activity.getApplication());
        return new ViewModelProvider(ViewModelStores.of(fragment), sDefaultFactory);
    }
}
```

呼び出されているコンストラクタのシグネチャはこんな具合です。

```
ViewModelProvider(ViewModelStore store, ViewModelProvider.Factory factory)
```

`ViewModelStore`とかいかにもあやしい名前のクラスが引数にあるので詳しく見てみましょう。
`ViewModelStores#of`の中を見てみるとこんな感じ

```java
public static ViewModelStore of(Fragment fragment) {
    return HolderFragment.holderFragmentFor(fragment).getViewModelStore();
}
```

`HolderFragment`なるものが出てきました。

コードを見てみると、コンストラクタで`setRetainInstance(true);`を呼んでいます。`retainInstance = true`にすると親Activity/Fragmentが再生成されても対象のFragmentは生き残るようになるので、この仕組みを使って`ViewModel`をActivity/fragmentの再生成後も使えるようにしているようです。

`ViewModelStore`はこの`HolderFragment`で管理されています。

`ViewModelStore`の実態は`HashMap<String, ViewModel>`です。ここで基本的には`ViewModel`のクラス名をキーとして`ViewModel`のインスタンスを管理しています。

`HolderFragment`はActivity/Fragment毎に作られるので、一つの`ViewModelStore`が管理するのは自`HolderFragment`の直接の親Activity/Fragmentの`ViewModel`だけです。

クラス名がキーなので同一Activity内、同一Fragment内で同じ`ViewModel`を複数使うことはできなそうな感じもしましたが、よくよく見ると外部からキーを指定できる`get`メソッドのオーバーロードも用意されていたので一応そういうユースケースも考慮されていそうです。

`ViewModel`の保存周り、ホントはもうちょっとゴニョゴニョしてるんだけど概要としてはこんな感じです。とてもわかりやすいコードなのでぜひ一読してみてください。



## 終わりに

ここ一年くらい触ってるyet another Fragmentの[Conductor](https://github.com/bluelinelabs/Conductor)がController(Fragmentのようなもの)をキャッシュするのにやっぱり`retainInstance = true`なFragmentを使ってて、Architecture Componentsの発表を聞いたときに同じようなことやってるのかなーって思ってたら案の定でちょっとニンマリしてしまった。

特に黒魔術してるわけでもなく、既存の仕組みをうまく使ってるだけなのでこの仕組み自体が黒歴史になることはなさそう。

`ViewModel`はActivity/Fragmentへの参照を持つことは推奨されてないので必然的にユニットテストしやすいコードになっていきそう。

とはいえ`ViewModel`だけで完全にテスタブルになるわけではないし、`ViewModel`はActivity/Fragmentの再生成をこえた状態のキャッシュに一つの道を示しただけなので、これですべてが解決するわけではない。

今までの知見と組み合わせつつ、幸せになれるコードを書けるようやっていきましょう、ということでざっくりとしたコードリーディングを終わります。
