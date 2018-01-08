---
layout: post
title: repeatWhenでfilterを使ってもonCompletedは呼ばれない
category:
  - programming;
tags:
  - rxjava
  - java
  - til
---

掲題の通りです

TL;DR

`Observable#repeatWhen`使って複雑な繰り返し判定するときは`Observable#filter`じゃなくて`Observable#takeWhile`を使うと`onCompleted`まで呼ばれる

---

大量のデータをローカルに同期するAPIがあって、ページングの要領で複数回APIを叩いてすべてのデータを同期するとします。  
こんな感じのコードなら動きます。

```java
boolean isLoading = false;

public Completable sync() {
    return Observable.defer(() -> {
        if (isLoading) {
          return Observable.empty();
        }
        isLoading = true;
        return syncData() 
    })
        .repeatWhen(observable -> {
            return observable.flatMap(aVoid -> isSyncCompleted().first())
                .takeWhile(completed -> !completed)
                .doOnCompleted(() -> Timber.d("sync completed")
                .doOnNext(completed -> Timber.d("should request next data");
        })
        .doOnCompleted(() -> isLoading = false)
        .toCompletable();
}
```

これ最初気づかなくて悩んだのですが、ここで`takeWhile`の代わりに`filter`を使うと`Observable#doOnCompleted`が呼ばれません。

```java
boolean isLoading = false;

public Completable sync() {
    return Observable.defer(() -> {
        if (isLoading) {
          return Observable.empty();
        }
        isLoading = true;
        return syncData() 
    })
        .repeatWhen(observable -> {
            return observable.map(aVoid -> isSyncCompleted())
                // これだとdoOnCompletedが呼ばれない
                .filter(completed -> !completed)
                .doOnCompleted(() -> Timber.d("sync completed")
                .doOnNext(completed -> Timber.d("should request next data");
        })
        .doOnCompleted(() -> isLoading = false)
        .toCompletable();
}
```

なのでこのコードだと`isSyncCompleted`がtrueを返したとしても`isLoading`が更新されず、再度`sync()`を呼ばれた時に必ず`return Observable.empty()`のルートに入ってしまいます。

`Observable#repeatWhen`のjavadocを読むと、以下のように書かれています。

> Returns an Observable that emits the same values as the source Observable with the exception of an {@code onCompleted}. An {@code onCompleted} notification from the source will result in the emission of a {@code void} item to the Observable provided as an argument to the {@code notificationHandler} function. If that Observable calls {@code onComplete} or {@code onError} then {@code repeatWhen} will call {@code onCompleted} or {@code onError} on the child subscription. Otherwise, this Observable will resubscribe to the source observable.


なるほど

> An {@code onCompleted} notification from the source will result in the emission of a {@code void} item to the Observable provided as an argument to the {@code notificationHandler} function.

元のObservableでonCompletedが呼ばれると、`notificationHandler`が渡してくるObservableの`onNext`が呼ばれるようです。

> If that Observable calls {@code onComplete} or {@code onError} then {@code repeatWhen} will call {@code onCompleted} or {@code onError} on the child subscription. Otherwise, this Observable will resubscribe to the source observable.

`onComplete`か`onError`が呼ばれないとresubscribeしてしまうようです。  

いつ自動的にonCompletedになるのか、という記述がありませんし、`notificationHandler`の引数のObservableは、文字通り`元のObservableでonCompletedが呼ばれた時にVoidをemitする`だけのObservableなのでしょう。とりあえず`onCompleted`が呼ばれるように`filter`をやめて`takeWhile`に変えてみたら意図した通りの動作になった次第です。

if文で分岐してempty返したりしてもイケるとは思いますが、とりあえずはこんな感じで。

---
参考: 

- https://github.com/ReactiveX/RxJava/issues/2889
- http://reactivex.io/RxJava/javadoc/rx/Observable.html#repeatWhen(rx.functions.Func1)
