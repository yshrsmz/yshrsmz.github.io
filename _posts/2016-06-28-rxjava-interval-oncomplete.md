---
layout: post
title: Observable&#35;intervalはunsubscribeしただけではonCompleteが呼ばれない
category:
  - programming
tags:
  - til
  - java
  - rxjava
---

Today I Learned的なことをやってみる

表題の通りなんだけど、[`Observable#interval`](http://reactivex.io/documentation/operators/interval.html)は`unsubscribe`しただけでは、`onComplete`まで呼ばれない。

```java
Subscription subscription = Observable.interval(1, TimeUnit.SECONDS)
  .subscribe(aLong -> {
    print("interval onNext: %d", aLong);
  }, throwable -> {
    print("interval onError");
  }, () -> {
    print("interval onComplete");
  });

Thread.sleep(3500)

subscription.unsubscribe();
```

こんなコード(擬似コード)を書くと、

```
interval onNext: 0
interval onNext: 1
interval onNext: 2
...
```

こんなログが出て、`subscription.unsubscribe()`が呼ばれたタイミングで、`interval onComplete`が出力されることなくログの出力が終了する。

`Observable#interval`はHot Observableで誰が`subscribe`してるとか関係ない感じなんだろうなーという認識。

どうやったらonComplete呼ばれるのん？っていうと下記スレッドでやり方が紹介されていた。  
[Call onComplete when an observable uses interval method.](https://groups.google.com/forum/#!topic/rxjava/WKawYWELg4E)

[`Observable#takeUntil`](http://reactivex.io/documentation/operators/takeuntil.html)を使うらしい。引数として受け取った`Observable`の`onNext`が呼ばれたら、それより後に来る元の`Observable`の`onNext`を全部無視するオペレータだ。


```java
PublishSubject<Void> stop = PublishSubject.create();
Subscription subscription = Observable.interval(1, TimeUnit.SECONDS)
  .takeUntil(stop)
  .subscribe(aLong -> {
    print("interval onNext: %d", aLong);
  }, throwable -> {
    print("interval onError");
  }, () -> {
    print("interval onComplete");
  });

Thread.sleep(3500)

stop.onNext(null);
```

こうすると`onComplete`が呼ばれて終了する。


ただ、`Observable#interval`使った時だけ`PublishSubject`で`unsubscribe`とかダルいなーって思ってたらこんなことができた

```java
PublishSubject<Void> stop = PublishSubject.create();
Subscription subscription = Observable.interval(1, TimeUnit.SECONDS)
  .doOnUnsubscribe(() -> {
    print("interval onUnsubscribe");
    stop.onNext(null);
  })
  .takeUntil(stop)
  .subscribe(aLong -> {
    print("interval onNext: %d", aLong);
  }, throwable -> {
    print("interval onError");
  }, () -> {
    print("interval onComplete");
  });

Thread.sleep(3500)

subscription.unsubscribe();
```

ログはこんな感じ

```
interval onNext: 0
interval onNext: 1
interval onNext: 2
...
interval onUnsubscribe
interval onComplete
```

`doOnUnsubscribe`はどうやら`Observer`にイベントが来なくなるより前に実行されるみたい。

これで`onComplete`は呼ばれるようになったけど、`Observable#takeUntil`のドキュメントを見る限りだと`Observable#intervale`のストリームは依然続いてそうな感じもするし、`onComplete`でしたい処理がある場合以外はこんなめんどくさいことしなくていいかもしれない。
