---
layout: post
title: RealmインスタンスをObservableのunsubscribe時にcloseする
categories:
  - programming;
tags:
  - android
  - realm
  - rxjava
---

※2016/07/21更新: このコードだけだと必ずしも同じスレッドでcloseされないことがわかりました。"[続:Realmインスタンスを、Observableのunsubscribe時に同じスレッドでunsubscribeする](https://yslibrary.net/2016/07/21/how-to-close-realm-upon-unsubscribe-on-same-thread/)"もご確認ください。

RealmはRxJavaを公式でサポートしていますが、公式のRxサポートが動くのはUIスレッドなど、Looperのあるスレッドだけです。

そこでRealmObjectをObservableで返すメソッドを自前で書いたりするわけですが、Rx使ってるとメソッドがどのスレッドから呼ばれるかわからないので、Realmをどこでcloseしたらいいかわからなくなりがちです。

そんな状態だとclose漏れのRealmインスタンスが発生して、OutOfMemoryExceptionが発生してしまいます。

最初は`doOnUnsubscribe`でやればいいじゃん？って思ってたんですが、`doOnUnsubscribe`は`Observer`のスレッドで呼ばれるみたいで、スレッド違いでエラーになってしまいます。

```java
public Obseravble<Realm> asObservable() {
  return Observable.defer(new Func0<Observable<Realm>>() {
    @Override
    public Observable<Realm> call() {
      Realm realm = Realm.getDefaultInstance();
      return Observable.just(realm)
        .doOnUnsubscribe(new Action0() {
            @Override
            public void call() {
              // asObservable()
              //   .subscribeOn(io())
              //   .flatMap(ream -> realm.where(Note.class).find().getTitle())
              //   .observeOn(mainThread())
              //   .subscribe(...)
              // こんな感じで書くとここはメインスレッドになってしまう→エラーでcloseできない
              realm.close();
            }
        });
    }
  });
}
```


いろいろ調べてみたら、Observableのライフサイクルに合わせてリソースを管理するためのオペレータがありました。

[Observable#using](http://reactivex.io/documentation/operators/using.html)といいます。
これを使って下記のようなコードを書き試してみたところ、無事`subscribeOn`したスレッドでclose処理が実行されました。

```java
public Obseravble<Realm> asObservable() {
  Observable.using(
    new Func0<Realm>() {
      @Override
      public Realm call() {
        // initialize resource
        return Realm.getDefaultInstance();
      }
    },
    new Func1<Realm, Observable<? extends Realm>>() {
      @Override
      public Observable<? extends Realm> call(Realm value) {
        // create observable using realm
        return Observable.just(value);
      }
    },
    new Action1<Realm>() {
      @Override
      public void call(Realm realm) {
        // dispose
        realm.close();
      }
    });
}
```

これを使って、あとはちゃんとunsubscribeされるよう気をつけていればRealmインスタンスのclose回数に注意しなくても済みそうです。
