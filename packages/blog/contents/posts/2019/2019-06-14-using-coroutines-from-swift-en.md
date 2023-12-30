---
layout: post
title: Using Kotlin Coroutines and Channel from Swift
category: programming
tags:
  - kotlin
  - kmp
  - swift
  - english
---


A while ago I wrote [an article about Kotlin Coroutines' Channel and Android Lifecycle](/2019/04/08/kotlin-channel-and-android-lifecycle-en/).

And some days later someone came to ask me "How can we use Coroutines/Channel from iOS code?"

I had wrote about it briefly [in Japanese](/2019/04/16/thoughts-on-kotlin-mpp/), but I thought I should write it in English too, so here it is.

---


Assume that I have a ViewModel like this.

```kotlin
class ViewModel(coroutineContext: CoroutineContext) : CoroutineScope {
  val states: Channel<State>
}
```

`State` is a data class which holds all UI state, and `ViewModel.states` emits state update.

Consuming this `val states: Channel<State>` is easy in Android. Just consume it(check out my previous post for the detail!)

But in iOS(Swift), it's not that easy. You can't just consume it.

So how?

I think there are two ways:

- Extend ViewModel and convert Channel to ordinary callback
- Create "Adapter" which implement `CoroutineScope`

Choice 1 is simple and easy to understand. Just like this.

```kotlin
class ViewModelForIos(coroutineContext: CoroutineContext) : ViewModel(coroutineContext) {
    fun onStateChanged(stateChanged: (State) -> Unit) {
        launch {
            states.consumeEach { newState ->
                stateChanged(newState)
            }
        }
    }
}
```

Because now you don't need to deal with channel directly, you can use this `ViewModel#observeState` in Swift.

Choice 2 is a bit complex, but still not that difficult.

```kotlin
class ViewModelAdapter(
    val context: CoroutineContext 
): CoroutineScope {

    private val job = SupervisorJob()
    override val coroutineContext: CoroutineContext = job + uiContext

    fun onSateChanged(viewModel: ViewModel, stateChanged: (state: ExchangeFromState) -> Unit) {
        launch {
            viewModel.states.consumeEach {
                stateChanged(it)
            }
        }
    }

    fun dispose() {
        job.cancel()
    }
}
```

Here's simple Adapter implementation. You can use this in Swift like below.

```swift
let viewModel = ViewModel(AppDispatcher)  // implement your own CoroutineContext
let adapter = ViewModelAdapter(AppDispatcher)

adapter.onStateChanged(viewModel) { state in 
    updateView(state)
    return KotlinUnit()
}

// call this when you don't need update anymore
adapter.dispose()
```

Actually, these two snippets are doing samething. Converting channel to callback.

Choice 2 might look like a lot of code, but you can use generics and in total you will save lots of lines of code conpared to choice 1. I personally call it "Adapter" pattern.


Hope this helps someone.

Have a good day!
