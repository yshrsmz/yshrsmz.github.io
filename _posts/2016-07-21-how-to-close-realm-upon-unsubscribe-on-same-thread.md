---
layout: post
title: 続:Realmインスタンスを、Observableのunsubscribe時に同じスレッドでunsubscribeする
category:
  - programming;
tags:
  - android
  - realm
  - rxjava
---

[前回](https://yslibrary.net/2016/07/08/how-to-close-realm-upon-unsubscribe/)の続きです。

`Observable#using`を使うと、Observableのunsubscribe時にRealmインスタンスを同じスレッド上で閉じることができるよ、と前回の記事で書きました。

結論から言うと前回のコードだけでは足りませんでした。  
大体の場合において同じスレッド上でcloseされるのですが、たまに別スレッドで閉じられてしまう、ということがわかりました。

Twitter上でうんうん言いながらRxJavaのコードを読みながら再現するコードを書こうとしてたら、[@hydrakecat](https://twitter.com/hydrakecat)さんが捕捉してくださり、さくっと再現させてくれました。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">やはり頑張ってRxJavaとRealmのコードを読み込むしかない</p>&mdash; せーい(yshrsmz) (@_yshrsmz) <a href="https://twitter.com/_yshrsmz/status/753075450906378241">2016年7月13日</a></blockquote>

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr"><a href="https://twitter.com/_yshrsmz">@_yshrsmz</a> うーん、再現したかも。とりあえず、このコードを何回も実行するとたまに main スレッドでクローズされますね。<a href="https://t.co/EHda8VQeEh">https://t.co/EHda8VQeEh</a></p>&mdash; Hiroshi Kurokawa (@hydrakecat) <a href="https://twitter.com/hydrakecat/status/753121477050953728">2016年7月13日</a></blockquote>

最初は毎回再現するわけじゃないしバグなのかな？　と思っていたのですが、どうやら`Observable#subscribeOn`はunsubscribeするスレッドを関知しないようでした。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr"><a href="https://twitter.com/_yshrsmz">@_yshrsmz</a> ううん、微妙なんですよね。subscribeOn() の JavaDoc には unsubscribe のスケジューラについて一言も書かれていませんし……。もうちょっとドキュメントとコードを当たってみます。</p>&mdash; Hiroshi Kurokawa (@hydrakecat) <a href="https://twitter.com/hydrakecat/status/753174895706509313">2016年7月13日</a></blockquote>

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr"><a href="https://twitter.com/hydrakecat">@hydrakecat</a> <a href="https://twitter.com/_yshrsmz">@_yshrsmz</a> unSubscribeOnでスレッド明示すればいいって話ではない感じですか？</p>&mdash; ちばっちんぐ (@chibatching) <a href="https://twitter.com/chibatching/status/753176554293694464">2016年7月13日</a></blockquote>

じゃあ`Observable#unsubscribeOn`指定したらいいじゃん？　というわけにもいきません。`Schedulers.io()`等のRxJavaが標準で用意しているスケジューラは、実行時にスレッドプールから適当なスレッドを渡すためです。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr"><a href="https://twitter.com/_yshrsmz">@_yshrsmz</a> <a href="https://twitter.com/chibatching">@chibatching</a> あ、駄目だ。Shcedulers.io() とか使うとスレッドが一緒になる保証ないですね……。自分でシングルスレッドのスケジューラ作らないといけないかも。</p>&mdash; Hiroshi Kurokawa (@hydrakecat) <a href="https://twitter.com/hydrakecat/status/753178239770562560">2016年7月13日</a></blockquote>

シングルスレッドのスケジューラだとRealm関連の操作が全部直列になってしまうしパフォーマンス的に良くないよな〜と思っていろいろ考えたのですが、妙案は思いつかず。  
最後の手段、ということでRxJavaのGithubレポにissueを投げてみました。

[Question about Observable.using's resourceFactory & disposeAction #4197 ReactiveX/RxJava](https://github.com/ReactiveX/RxJava/issues/4197)


回答は以下のような感じでした。

> Hi.
>
> 1) Yes. The operator doesn't deal with scheduling.
> 2) Not with subscribeOn; try unsubscribeOn but you need a single-threaded Scheduler as all the default ones will give you different threads most likely.

やはり、[@hydrakecat](https://twitter.com/hydrakecat)さんと[@chibatching](https://twitter.com/chibatching)さんがおっしゃっていたように`Observable#unsbscribeOn`とシングルスレッドのスケジューラを合わせるのが正攻法のようです。


最終的な解決策は上述のissueにも書きましたが、複数のシングルスレッドスケジューラを順番に使い回す、という形になりました。

```java
public class RealmSchedulerPool {

    private final static String PREFIX = "RealmScheduler-";

    private final static List<Scheduler> SCHEDULERS = new ArrayList<Scheduler>(){
        {
            add(Schedulers.from(Executors.newSingleThreadExecutor(new RxThreadFactory(PREFIX + "1-"))));
            add(Schedulers.from(Executors.newSingleThreadExecutor(new RxThreadFactory(PREFIX + "2-"))));
            add(Schedulers.from(Executors.newSingleThreadExecutor(new RxThreadFactory(PREFIX + "3-"))));
        }
    };

    private final static AtomicLong COUNT = new AtomicLong(0L);

    private RealmSchedulerPool() {
        // no-op
    }

    public static Scheduler get() {
        long current = COUNT.getAndIncrement();
        return SCHEDULERS.get((int) (current % 3)); // 3 is the size of SCHEDULERS
    }
}


public static <T> Observable.Transformer<T, T> doInRealmScheduler() {
  return tObservable -> {
    Scheduler s = RealmSchedulerPool.get();
    return tObservable
            .subscribeOn(s)
            .unsubscribeOn(s);
  };
}
```

これを前回のコードと合わせて下記のように使います。

```java
asObservable()
  .compose(doInRealmScheduler())
  .map(realm -> realm.where(Foo.class).findAll());
```

助言をくださった[@hydrakecat](https://twitter.com/hydrakecat)さん、[@chibatching](https://twitter.com/chibatching)さん、ありがとうございました。
