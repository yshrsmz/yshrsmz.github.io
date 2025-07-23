---
layout: post
title: Service で Jetpack Compose を使ってオーバーレイウィンドウを実装する
tags:
  - Android
  - Jetpack Compose
  - Service
  - Kotlin
---

Service で Compose 使いたいなーと思って実装したら、思った以上にハマりポイントがあったので共有。

**目次**
[[toc]]

## TL;DR

- Service でも LifecycleOwner、ViewModelStoreOwner、SavedStateRegistryOwner を実装すれば Compose 使える
- SavedStateRegistry の初期化順序が重要（INITIALIZED ステートで `performRestore()` を呼ぶ）
- ComposeView に 3 つの owner をすべて設定する必要がある
- オーバーレイウィンドウとかで便利

## なんで Service で Compose が必要？

今回作ってたのは、他のアプリの上に表示されるオーバーレイウィンドウ。ブラウザから URL を共有する際に共有先にこのアプリを選択すると、共有する前に内容を少しいじることができる。このいじるかどうかを選択するためのボタンを、オーバーレイで表示する、という寸法だ。

最初は XML でレイアウト作ってたんだけど、アプリ全体を Jetpack Compose に移行しようということで、 Service 使って表示してるオーバーレイ UI も移行した。

## 基本的な実装

### 必要なインターフェースの実装

Service で Compose を使うには、3 つのインターフェースを実装する必要がある：

```kotlin
@AndroidEntryPoint
class MyOverlayService : Service(), 
    LifecycleOwner, 
    ViewModelStoreOwner, 
    SavedStateRegistryOwner {
    
    private lateinit var lifecycleRegistry: LifecycleRegistry
    private lateinit var savedStateRegistryController: SavedStateRegistryController
    private lateinit var _viewModelStore: ViewModelStore
    
    // 各インターフェースの実装
    override val lifecycle: Lifecycle
        get() = lifecycleRegistry
        
    override val viewModelStore: ViewModelStore
        get() = _viewModelStore
        
    override val savedStateRegistry: SavedStateRegistry
        get() = savedStateRegistryController.savedStateRegistry
}
```

### 初期化の順序が超重要

ここが一番ハマった。SavedStateRegistry の初期化順序を間違えると、クラッシュが発生する。

```kotlin
override fun onCreate() {
    super.onCreate()
    
    // 1. まず Lifecycle を INITIALIZED 状態で作成
    lifecycleRegistry = LifecycleRegistry(this)
    // まだ CREATED にしない！
    
    // 2. SavedStateRegistry を作成して、INITIALIZED 状態で restore
    savedStateRegistryController = SavedStateRegistryController.create(this)
    savedStateRegistryController.performRestore(null)
    
    // 3. ここでようやく CREATED に移行
    lifecycleRegistry.currentState = Lifecycle.State.CREATED
    
    // 4. ViewModelStore と ViewModel を作成
    _viewModelStore = ViewModelStore()
    viewModel = ViewModelProvider(_viewModelStore, viewModelFactory)
        .get(MyServiceViewModel::class.java)
}
```

CREATED にしたあとに `performRestore()` 呼ぶと、`SavedStateRegistry#performRestore can only be called in INITIALIZED state` ってエラーが出るので注意。

### ComposeView の設定

ComposeView を作るときは、3 つの owner をすべて設定する：

```kotlin
private fun createComposeView(): ComposeView {
    return ComposeView(this).apply {
        setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)
        
        // 3 つの owner をすべて設定
        setViewTreeLifecycleOwner(this@MyOverlayService)
        setViewTreeViewModelStoreOwner(this@MyOverlayService)
        setViewTreeSavedStateRegistryOwner(this@MyOverlayService)
        
        setContent {
            MyOverlayContent(viewModel)
        }
    }
}
```

## オーバーレイウィンドウの実装

### WindowManager の設定

オーバーレイウィンドウとして表示するための設定：

```kotlin
private fun showOverlay() {
    val windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
    
    val layoutParams = WindowManager.LayoutParams(
        WindowManager.LayoutParams.WRAP_CONTENT,
        WindowManager.LayoutParams.WRAP_CONTENT,
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        },
        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
        PixelFormat.TRANSLUCENT
    ).apply {
        gravity = Gravity.CENTER_HORIZONTAL or Gravity.BOTTOM
        y = 100 // 下から 100px の位置
    }
    
    val composeView = createComposeView()
    windowManager.addView(composeView, layoutParams)
}
```

### Compose UI の実装

普通の Compose と同じように書ける：

```kotlin
@Composable
fun MyOverlayContent(viewModel: MyServiceViewModel) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    
    MaterialTheme {
        Surface(
            modifier = Modifier
                .wrapContentSize()
                .padding(16.dp),
            shape = RoundedCornerShape(8.dp),
            shadowElevation = 8.dp
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = uiState.message,
                    style = MaterialTheme.typography.bodyLarge
                )
                
                Row(
                    modifier = Modifier.padding(top = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    TextButton(onClick = viewModel::onCancel) {
                        Text("キャンセル")
                    }
                    Button(onClick = viewModel::onConfirm) {
                        Text("共有")
                    }
                }
            }
        }
    }
}
```

### アニメーション付きの表示

せっかく Compose なので、アニメーション付けてみた：

```kotlin
@Composable
fun AnimatedOverlay(
    isVisible: Boolean,
    content: @Composable () -> Unit
) {
    val scale = remember { Animatable(0f) }
    val alpha = remember { Animatable(0f) }
    
    LaunchedEffect(isVisible) {
        if (isVisible) {
            // 表示アニメーション
            launch {
                scale.animateTo(
                    targetValue = 1f,
                    animationSpec = spring(
                        dampingRatio = Spring.DampingRatioMediumBouncy,
                        stiffness = Spring.StiffnessLow
                    )
                )
            }
            launch {
                alpha.animateTo(
                    targetValue = 1f,
                    animationSpec = tween(200)
                )
            }
        } else {
            // 非表示アニメーション
            launch {
                alpha.animateTo(0f, tween(150))
            }
            launch {
                scale.animateTo(0f, tween(150))
            }
        }
    }
    
    Box(
        modifier = Modifier
            .scale(scale.value)
            .alpha(alpha.value)
    ) {
        content()
    }
}
```

XML だとこういうアニメーション実装するの大変だけど、Compose だと簡単に書ける。

## Android 15 での制限について

Android 15（API レベル 35）では、オーバーレイウィンドウに関していくつかの制限が追加されている：

1. **フォアグラウンドサービスの制限強化**
   - `TYPE_APPLICATION_OVERLAY` を使用する場合でも、フォアグラウンドサービスとして実行する必要がある
   - 通知を表示し続ける必要があるため、ユーザー体験的に微妙

2. **オーバーレイの表示時間制限**
   - システムが一定時間後に自動的にオーバーレイを非表示にする可能性がある
   - 長時間表示し続けるような使い方は推奨されない

3. **セキュリティ強化**
   - 他のアプリの上に表示される UI に対する審査が厳しくなった
   - Play Store での公開時に追加の説明が必要になる場合がある

これらの制限を考慮すると、オーバーレイウィンドウよりも通常の Activity を使った実装のほうが将来的には安全かもしれない。とはいえ、Quick Share のような一時的な表示であれば、今のところ問題なく動作している。

## ViewModel の使用

Service でも ViewModel が使える。依存性注入（Hilt）も普通に動く：

```kotlin
@HiltViewModel
class MyServiceViewModel @Inject constructor(
    private val repository: MyRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(OverlayUiState())
    val uiState: StateFlow<OverlayUiState> = _uiState.asStateFlow()
    
    fun onConfirm() {
        viewModelScope.launch {
            repository.shareContent(_uiState.value.content)
            _uiState.update { it.copy(dismiss = true) }
        }
    }
}

// Service で ViewModelFactory 経由で取得
@Inject lateinit var viewModelFactory: MyViewModelFactory

private lateinit var viewModel: MyServiceViewModel

override fun onCreate() {
    super.onCreate()
    // ... lifecycle初期化 ...
    
    viewModel = ViewModelProvider(_viewModelStore, viewModelFactory)
        .get(MyServiceViewModel::class.java)
}
```

## ライフサイクルの管理

適切にライフサイクルを管理しないとメモリリークする：

```kotlin
override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    lifecycleRegistry.currentState = Lifecycle.State.STARTED
    
    // インテント処理
    handleIntent(intent)
    
    return START_NOT_STICKY
}

override fun onDestroy() {
    super.onDestroy()
    
    // ComposeView を削除
    popupView?.let {
        windowManager.removeView(it)
        popupView = null
    }
    
    // ライフサイクルを DESTROYED に
    lifecycleRegistry.currentState = Lifecycle.State.DESTROYED
    
    // ViewModelStore をクリア
    _viewModelStore.clear()
}
```

## プレビューでの確認

Service の UI もプレビューで確認できる。`LocalInspectionMode` を使えば、プレビュー時の表示を調整できる：

```kotlin
@Composable
fun MyOverlayContent() {
    val isInPreview = LocalInspectionMode.current
    
    // プレビューでは固定値を表示
    val uiState = if (isInPreview) {
        OverlayUiState(message = "プレビューメッセージ")
    } else {
        viewModel.uiState.collectAsStateWithLifecycle().value
    }
    
    // UI 実装
}

@Preview
@Composable
fun MyOverlayPreview() {
    MaterialTheme {
        MyOverlayContent()
    }
}
```

## ハマったポイントまとめ

1. **SavedStateRegistry の初期化順序**
   - 必ず INITIALIZED 状態で `performRestore()` を呼ぶ
   - その後で CREATED に移行

2. **ComposeView の owner 設定**
   - 3 つの owner すべて設定しないと動かない
   - 忘れがちなのは SavedStateRegistryOwner

3. **Theme の適用**
   - Service には Activity のような Theme がないので、Compose 内で明示的に指定

4. **メモリリーク対策**
   - onDestroy で確実に View を削除
   - ViewModelStore の clear() も忘れずに

## まとめ

Service で Compose 使うの、めんどくさいといえばめんどくさいけど、View で作っていたときと同様に手順さえ踏めばうまく動く(`ComposeView` 使ってるのでそれはそう)。

特にアニメーションとか状態管理が必要な場合は、Compose の恩恵を強く感じる。SavedStateRegistry の初期化順序さえ間違えなければ、そんなに難しくないので、Service で UI 表示したい人は試してみてほしい。
