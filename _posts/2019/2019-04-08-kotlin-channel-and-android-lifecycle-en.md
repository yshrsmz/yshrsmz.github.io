---
layout: post
title: Kotlin Coroutines' Channel and lifecycle of Android's components
category: programming
tags:
  - kotlin
  - android
  - english
---

How should we handle Kotlin Coroutines' channel in Android's components, especially in Activity/Fragment?

This is the English translation of the [previous post](https://www.yslibrary.net/2019/04/04/kotlin-channel-and-android-lifecycle/).


```kotlin
class FooViewModel {
    private var _state: State
    val state: State
        get() = _state

    private val _states = BroadcastChannel<State>(1)
    val states: ReceiveChannel<State>
        get() = _states.openSubscription().also { _states.offer(state) }

    // reducer and other stuff here
}
```

Say we havve a ViewModel like above.
It's based on MVI-like architecture. `FooViewModel.states` will notify us if there's any state update.

This `FooViewModel` is in a Kotlin Multiplatform Project Module is targeting Android and iOS, so we can't use `LiveData`.
Of cource we can choose to create some kind of `Observable` by ourselves, but because we have Kotlin Coroutines, I'd like to use Channel.

The problem is, how we should handle channel inside Activity/Fragment, based on its lifecycle. Channel cannot be paused/resumed, so we need to came up with something.

Two ideas poped up into my head: `LifecycleObserver` and `LiveData`.

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

Implementation is fairly simple. Inspired  by `LiveData`, just start subscribing to a channel the Activity/Fragment enters onStart/onResume, and canceled the cached `Job` when the Activity/Fragment enters onPause/onStop.
Actual usage is below.


```kotlin
class FooActivity: AppCompatActivity() {
    val channelLifecycle by lazy { ChannelLifecycleObserver(this) }
    val viewModel: FooViewModel by lazy { /* Obtain a ViewModel */ }

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

It's implemented as an extension function for a method and for me it looks a bit weired, but it is necessary since `ReceiveChannel` is un-reusable after its cancellation and exposing `BroadcastChannel` is not acceptable. So we need to re-create `ReceiveChannel` each time.
We assume that the latest data is cached inside the ViewModel.

Implementation using `LiveData` should be pretty much the same, but I didn't dig into it so much as I don't want to think about the cache by `LiveData`.

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

Please not that you should not call these in lifecycle events which will be called many times in its whole lifecycle, such as `onStart` or `onResume`. Each time you call `fun <E> (() -> ReceiveChannel<E>).consumeEach(lifecycleObserver, action)`, it will cache that call regardless of the previous call, and you eventually duplicate subscription.
