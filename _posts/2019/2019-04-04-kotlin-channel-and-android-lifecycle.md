---
layout: post
title: Kotlin CoroutinesのChannelとAndroidのライフサイクル
category: programming
tags:
  - kotlin
  - android
---

Kotlin CoroutinesのChannelをAndroidでいい感じに使うにはどうしたらいいかなー、という話。

```kotlin
class FooViewModel {
    private var _state: State
    val state: State
        get() = _state

    private val _states = BroadcastChannel<State>(1)
    val states: ReceiveChannel<State>
        get() = _states.openSubscription().also { _states.offer(state) }

    // reducerとか他にいろいろある
}
```

ちょーざっくりこんな感じのViewModelがあるとする。  
MVI的なアーキテクチャになっていて、 `FooViewModel.states` がStateの更新を通知してくれる。  
このViewModelはKotlin Multiplatformなモジュールに存在し、Android/iOSで使い回すためにLiveDataを使うことはできない。  
適当なObservableを実装することもできるけど、まあせっかくなのでKotlin CoroutinesのChannelを使ってみようと思いこんな感じになっている。

問題は、この `FooViewModel.states` をどうやってActivity/Fragmentのライフサイクルにあわせて使うか、ということだ。  
Channelは現状pause/resumeができないので、なんとかする必要がある。

パッと思いついたのはLiveDataを実装する方法とLifecycleObserverを実装する方法だ。

```kotlin
class ChannelLifecycleObserver(
    private val owner: LifecycleOwner
) : LifecycleObserver, CoroutineScope by MainScope() {

    private val channels = mutableMapOf<ChannelHandler<*>, Job?>()

    private val shouldBeActive
        get() = owner.lifecycle.currentState.isAtLeast(Lifecycle.State.STARTED)

    private var isActive: Boolean = false

    fun <T> add(handle: ChannelHandler<T>) {
        val job = if (shouldBeActive) {
            handle.start(this)
        } else null

        channels[handle] = job
    }

    @Suppress("unused")
    @OnLifecycleEvent(Lifecycle.Event.ON_ANY)
    fun onStateChanged(source: LifecycleOwner, event: Lifecycle.Event) {
        if (owner.lifecycle.currentState == Lifecycle.State.DESTROYED) {
            cancel()
            return
        }

        val newActive = shouldBeActive
        // skip subsequent process if the active state is not changed
        // ex: STARTED -> RESUMED
        if (isActive == newActive) {
            return
        }
        isActive = newActive

        if (isActive) {
            println("should be active, register channels")

            channels.entries.forEach { (handle, job) ->
                if (job?.isActive == true) {
                    job.cancel()
                }
                channels[handle] = handle.start(this)
            }
        } else {
            println("should be inactive, deregister channels")
            channels.entries.forEach { (handle, job) ->
                job?.cancel()
                channels[handle] = null
            }
        }
    }

    data class ChannelHandler<T>(val channelFactory: () -> ReceiveChannel<T>, val action: (T) -> Unit) {
        fun start(coroutineScope: CoroutineScope): Job {
            return coroutineScope.launch {
                channelFactory().consumeEach { value ->
                    action(value)
                }
            }
        }
    }
}

/**
 * Start/Cancel subscribing [ReceiveChannel] depending on a provided [lifecycleObserver].
 */
fun <E> (() -> ReceiveChannel<E>).consumeEach(lifecycleObserver: ChannelLifecycleObserver, action: (E) -> Unit) {
    lifecycleObserver.add(
        ChannelLifecycleObserver.ChannelHandler(
            channelFactory = this,
            action = action
        )
    )
}
```

実装はシンプルで、LiveDataの処理を参考にしつつViewを更新できる状態になったらChannelを購読開始、Viewに触れない状態になったらキャッシュしておいたJobをキャンセル、としている。
Activity/Fragmentでこんな感じに使う。

```kotlin
class FooActivity: AppCompatActivity() {
    val channelLifecycle by lazy { ChannelLifecycleObserver(this) }
    val viewModel: FooViewModel by lazy { /* ViewModelを取得 */ }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_foo)

        // add to lifecycle
        lifecyle.addObserver(channelLifecycle)

        // use method reference!
        viewModel::states.consumeEach(channelLifecycle) { state -> 
            Log.d("FooActivity", "State Updated: $state")
        }
    }
}
```

メソッド参照の拡張関数になっている点が若干気持ち悪いが、これは　`ReceiveChannel` がcancelされたあとに再利用できないからだ。  
かと言って `BroadcastChannel`  のまま公開するわけにもいかないので、まあ仕方ない。  
ViewModel側で最新の値はキャッシュしている前提で、 `ReceiveChannel` を毎回作り直すことにした。

LiveDataのパターンもだいたい同じ感じでできるはず。

```kotlin
class ChannelLiveData<T>(
    private val channelFactory: () -> ReceiveChannel<T>
) : LiveData<T>(), CoroutineScope by MainScope() {

    private var job: Job? = null

    override fun onActive() {
        super.onActive()

        job = launch {
            channelFactory().consumeEach { value ->
                setValue(value)
            }
        }
    }

    override fun onInactive() {
        super.onInactive()

        job?.cancel()
    }
}

fun <T> (() -> ReceiveChannel<T>).toLiveData(): LiveData<T> = ChannelLiveData(this)
```

どっちの実装もそうだけど、`onResume` とか画面のライフサイクル内で複数回呼ばれる場所に書いてしまうと実行されるたびにChannelの購読数が増え、処理が重複してしまうので注意が必要。
