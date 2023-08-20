---
layout: post
title: CompositeSubscriptionは再利用できる
category: programming
tags:
  - java
  - rxjava
---

RxJavaの `CompositeSubscription` は一度 `unsubscribe()` してしまうと使い回すことができないので毎回インスタンス化しなきゃいけないと思っていたら、`clear()` というメソッドがあることを知った。  
`clear()` は追加済みの `Subscription` の `unsubscribe` は行うが、 `CompositeSubscription` 自体の状態は変更しないメソッドだ。  
これをメインで使うようにしたらちょっと面倒が減りそうな気がする。
すでに `unsubscribe()` してしまった `CompositeSubscription` に効果はないので注意が必要だけれども。

```java
@Override
public void unsubscribe() {
    if (!unsubscribed) {
        Collection<Subscription> unsubscribe = null;
        synchronized (this) {
            if (unsubscribed) {
                return;
            }
            unsubscribed = true;
            unsubscribe = subscriptions;
            subscriptions = null;
        }
        // we will only get here once
        unsubscribeFromAll(unsubscribe);
    }
}
```



```java
/**
 * Unsubscribes any subscriptions that are currently part of this {@code CompositeSubscription} and remove
 * them from the {@code CompositeSubscription} so that the {@code CompositeSubscription} is empty and in
 * an unoperative state.
 */
public void clear() {
    if (!unsubscribed) {
        Collection<Subscription> unsubscribe = null;
        synchronized (this) {
            if (unsubscribed || subscriptions == null) {
                return;
            } else {
                unsubscribe = subscriptions;
                subscriptions = null;
            }
        }
        unsubscribeFromAll(unsubscribe);
    }
}
```

こうして比べてみると、`unsubscribe()` の方では `unsubscribed = true` で `CompositeSubscription` の状態を変更しているが、 `clear()` では `Subscription` の開放のみを実行している。

`clear()` のコメントには `an unoperative state` と書いてあるが、実際のコードを読むと真逆のことが書いてあるので注意が必要。

### 参考
[RxJava/CompositeSubscription.java at dded0d2f3d7e4b715040f5a588cb2d709cad9493 · ReactiveX/RxJava](https://github.com/ReactiveX/RxJava/blob/dded0d2f3d7e4b715040f5a588cb2d709cad9493/src/main/java/rx/subscriptions/CompositeSubscription.java#L99-L134)
