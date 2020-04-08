---
layout: post
title: Kotlin Multiplatform Projectで考えることいろいろ
category: programming
tags:
  - kotlin
  - kmp
---

グダグダ書くよ

---

Android/iOSアプリをKotlin Multiplatform Projectで作るのにいい感じのアーキテクチャをいろいろ試行錯誤している。

Kotlin Multiplatform Projectでアプリを作るにあたって、単純にAndroidアプリを作るようにはいかないところがいくつかあるので、なかなかおもしろい。
その"おもしろい"点というのは、たとえば下記のような点だ。

- Kotlin Multiplatform ProjectではRxが使えない
- LiveDataもAndroid Specificなので使えない
- 非同期は基本Coroutinesでやる必要がある
- CoroutinesはSwiftから使えない
- Kotlin/Nativeでは`freezing`というランタイムの特性があり、変更可能なデータがスレッドをまたげない

## 前提条件

- 筆者はMVI(Model - View - Intent)推し
- Clean Architectureぽい階層型のアーキテクチャを採用している

## 非同期

最初の３つはまあ言いたいことは同じで、つまりリアクティブを実現するための仕組みがKotln Coroutinesしかない、ということだ。  
データのストリームは基本的にKotlin CoroutinesのChannelを利用して表現することになりそう。  
Flowというコールドストリームの実装が1.3.30で来たけど、ViewModelから公開するStateのストリームにはChannelのほうが相性は良さそう。  
ユースケースとかデータ層とか、場所によっては使えそう。このへんの使い分けはRxJavaのSubject/Observableと変わらない。  
ChannelをFlowに変換していろいろなオペレータで加工する、というのは勿論ありうるしようやくRx的なことができるようになって嬉しい限り。

`LiveData`は最近更新が途絶えてるけど[Multiplatform対応のライブラリがある](https://github.com/florent37/Multiplatform-LiveData)ので、それを更新すればいけなくもない。  
とはいえKotlin Coroutinesがかなり充実してきているのでわざわざ使う必要もなさそう。

AndroidではActivity/Fragmentで[ChannelをLiveDataに変換してあげる](https://www.yslibrary.net/2019/04/04/kotlin-channel-and-android-lifecycle/)とちょっと扱いやすくなるかもしれない。  
最近はAndroid JetpackのCoroutinesサポートが充実してきたのであんま必要ないかも。

## CoroutinesとSwift

ただCoroutinesはSwiftから直接呼べないので、コールバック形式に変換してあげる必要がある。  
あるいは、`CoroutineScope`を実装したアダプタのようなものを作ってあげるのもいいかもしれない。

```kotlin
class ViewModel : CoroutineScope{
  val states: Channel<State>
}
```

たとえば上記のような`ViewModel`があったとして、この`val states: Channel<State>`はSwift側からは普通に触ることはできない。  
そこで下記のようなクラスを用意する。

```kotlin
class StateListener(val context: CoroutineContext) : CoroutineScope {
  override val coroutineContext = context + SupervisorJob()

  fun listenToStateUpdate(viewModel: ViewModel, callback: (state: State) -> Unit) {
    launch {
      viewModel.states.consumeEach { s -> 
        callback(s)
      }
    }
  }
}
```

これをSwiftで書かれた`ViewController`で使えば、`ViewModel`のI/Fを変えないまま使い回すことができる。  
`ViewModel`も`StateListener`も`CoroutineScope`を実装しているので、適当なタイミングで`CoroutineScope#cancel()`を呼んであげればライフサイクル的な問題もないはず。  
ただこれは基本的にただのリスナですよー、って認識を徹底してここにiOS固有のロジックを書かないようにしたほうがいい。

あと、Kotlin/Nativeではジェネリクスが使えない(使えるけど、Kotlin外から見るとAnyになってしまう)ので、このリスナクラスは`ViewModel`ごとに作ってあげる必要がある。  
Objective-Cヘッダのジェネリクスまわりは[1.3.40から改善しそう](https://github.com/JetBrains/kotlin-native/pull/2850)なので期待。

ちなみにKotlin/Native上のCorutinesはメインスレッドしかサポートしてないので注意が必要。  
commonコードでAndroidの`Dispatchers.IO`とか意識したい場合は、下記の用に`expect - actual`で書き分けたらよい。

```
// common
expect val mainContext: CoroutineContext
expect val backgroundContext: CoroutineContext


// android
actual val mainContext: CoroutineContext = Dispatchers.Main
actual val backgroundContext: CoroutineContext = Dispatchers.IO

// ios. 自分で用意したメインスレッド用のDispatcherを使う
actual val mainContext: CoroutineContext = ApplicationDispatcher
actual val backgroundContext: CoroutineContext = ApplicationDispatcher
```

## freezing

Kotlin/Nativeでは[Concurrencyのモデル](https://github.com/JetBrains/kotlin-native/blob/master/CONCURRENCY.md)がJVMとはかなり異なっている。  
`Worker`というAPIを使えば並列処理はできるけど、そもそもKotlin/NativeにしかないAPIなのでKMPでcommonコードから扱いたいときは各プラットフォーム用の抽象化が難しい。

また、Workerとメインスレッドでオブジェクトをやり取りする際はオブジェクトを`freeze`しなければならない。`freeze`したオブジェクトは変更不可能になり、`var`で宣言した値でも再アサインしようとすると`InvalidMutabilityException`が投げられる(そう、ランタイムの特性なのだ！)。  
また、`freeze`されたオブジェクトを参照してたり参照したりしてるオブジェクト(オブジェクトのサブグラフ)も`freeze`されるのでよくわからないことになる。  
AtomicReference系の一部クラスを使うこともできるけど非常に限られたAPIで、無理をして実装するよりは新しいパラダイムになれたほうがよさそう。

ちなみに`freeze`されたコールバックのラムダ式とかからCoroutinesを使おうとすると、マルチスレッド対応してないので前述の`InvalidMutabilityException`を投げて死ぬ。  

コールバックをサブグラフに注意しつつThreadLocalで保持して、`freeze`されたラムダ内からメインスレッドに戻した後に呼ぶ、とか回りくどいことをやれば一応回避はできる。できるけどメインスレッドには戻ってしまう。

詳しくは文末の参考資料に挙げた記事を読んでみてほしい。  
[touchlab/DroidconKotlin](https://github.com/touchlab/DroidconKotlin/)が実装としては参考になる。

ちなみにKotlin Multiplatform対応のSQLIte3ラッパー[square/sqldelight](https://github.com/square/sqldelight)のクエリリスナは`freeze`されるので、この辺の考慮が必要。

## まとめ

- リアクティブプログラミングはKotlin CoroutinesのChannel/Flowを使って実現
- Swiftから使うときはコールバック形式に変換するかアダプタを作ってあげる
- `freezing`厄介

実際に採用したアーキテクチャについてはまた後ほど詳しく書くかも。


## 参考

- [kotlin-native/CONCURRENCY.md at master · JetBrains/kotlin-native](https://github.com/JetBrains/kotlin-native/blob/master/CONCURRENCY.md)
- [Kotlin/Native (Stranger) Threads – Kevin Galligan – Medium](https://medium.com/@kpgalligan/kotlin-native-stranger-threads-c0cf0e0fb847)
- [Kotlin Native Stranger Threads Ep 2 – Kevin Galligan – Medium](https://medium.com/@kpgalligan/kotlin-native-stranger-threads-ep-2-208523d63c8f)
- [Kpgalligan/20190315/generics by kpgalligan · Pull Request #2850 · JetBrains/kotlin-native](https://github.com/JetBrains/kotlin-native/pull/2850)
- [Support multi-threaded coroutines on Kotlin/Native · Issue #462 · Kotlin/kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines/issues/462)
- [touchlab/DroidconKotlin](https://github.com/touchlab/DroidconKotlin/)
