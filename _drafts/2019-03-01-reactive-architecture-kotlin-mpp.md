---
layout: post
title: Kotlin Multiplatform Projectでのリアクティブアーキテクチャ
category: programming
tags:
  - kotlin
---

Android/iOSアプリをKotlin Multiplatform Projectで作るのにいい感じのアーキテクチャをいろいろ試行錯誤している。

Kotlin Multiplatform Projectでアプリを作るにあたって、単純にAndroidアプリを作るようにはいかないところがいくつかあるので、なかなかおもしろい。
その"おもしろい"点というのは、たとえば下記のような点だ。

- Kotlin Multiplatform ProjectではRxが使えない
- LiveDataもAndroid Specificなので使えない
- 非同期は基本Coroutinesでやる必要がある
- CoroutinesはSwiftから使えない
- Kotlin/Nativeでは`freeze`というランタイムの特性があり、変更可能ななデータがスレッドをまたげない

## 非同期

最初の３つはまあ言いたいことは同じで、つまりリアクティブを実現するための仕組みがKotln Coroutinesしかない、ということだ。  
データのストリームは基本的にKotlin CoroutinesのChannelを利用して表現することになりそう。

`LiveData`は最近更新が途絶えてるけどMultiplatform対応のライブラリがあるので、それを更新すればいけなくもない。  
とはいえRxと比べるとできることは少ないし、ネットワークライブラリのKtorはI/FがCoroutiensなのでやはりCoroutinesをメインで使って、`LiveData`は仮に使うとしてもViewとのI/F部分に限定するくらいがよさそう。

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

あと、Kotlin/Nativeではジェネリクスが使えない(Kotlin外から見るとAnyになってしまう)ので、このリスナクラスは`ViewModel`ごとに作ってあげる必要がある。

## freeze
