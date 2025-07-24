---
layout: post
title: SharedPreferences から DataStore への移行でユーザーデータを守る
tags:
  - Android
  - DataStore
  - SharedPreferences
  - Kotlin
  - Migration
---

SharedPreferences から DataStore Preferences への移行を実施した。ユーザーの設定データを失わないように、慎重に移行する必要があったので、その記録を残しておく。

**目次**
[[toc]]

## TL;DR

- DataStore は型安全で Coroutines 対応
- 移行は `DataStoreMigration` を使えば自動化できる
- 文字列の wrapping/unwrapping に注意（後方互換性）
- CorruptionHandler で破損時の対処も可能

## なぜ DataStore に移行するのか

公式のドキュメントでも現在は SharedPreferences から DataStore への移行が推奨されている。
実際に下記のようなメリットもある。

- Kotlin Coroutines 対応で、Flow で変更を監視できる
- Protocol Buffers 版なら完全に型安全。datastore-preferences でも SharedPreferences よりは考慮されている
- Atomic な更新が可能
- 非同期でメインスレッドをブロックしない


## 移行パターン

### 基本的な移行

一番シンプルなケースはこんな感じ。

```kotlin
// SharedPreferences（移行前）
class UserPreferences(context: Context) {
    private val prefs = context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE)
    
    fun getUserId(): String? = prefs.getString("user_id", null)
    fun setUserId(id: String) = prefs.edit().putString("user_id", id).apply()
}

// DataStore（移行後）
class UserDataStore(context: Context) {
    private val Context.dataStore by preferencesDataStore(
        name = "user_preferences",
        produceMigrations = { context ->
            listOf(
                SharedPreferencesMigration(
                    context,
                    "user_prefs" // 既存の SharedPreferences 名
                )
            )
        }
    )
    
    private val dataStore = context.dataStore
    
    companion object {
        val USER_ID = stringPreferencesKey("user_id")
    }
    
    val userId: Flow<String?> = dataStore.data
        .map { preferences -> preferences[USER_ID] }
    
    suspend fun setUserId(id: String) {
        dataStore.edit { preferences ->
            preferences[USER_ID] = id
        }
    }
}
```

`SharedPreferencesMigration` を使えば、既存のデータが自動的に移行される。便利！

## ハマりポイント

### 1. 文字列の Wrapping 問題

以前の記事「[SharedPreferences に末尾が改行になる文字列を保存するとよくわからんスペースが4つ追加される件](/posts/2024/2024-11-11-android-sharedprefs-newline-spaces)」で書いたように、SharedPreferences には改行文字周りのバグがあるため、文字列を `"` で囲んで保存する workaround を使ってた。

この workaround を使った既存データを DataStore に移行する場合、unwrap 処理が必要。

```kotlin
// 移行時の処理
private val Context.dataStore by preferencesDataStore(
    name = "app_preferences",
    produceMigrations = { context ->
        listOf(
            SharedPreferencesMigration(
                context = context,
                sharedPreferencesName = "app_prefs",
                keysToMigrate = setOf("config")
            ) { prefs ->
                // 移行時に unwrap する（前後のダブルクォートを除去）
                val config = prefs.getString("config", null)
                    ?.removeSurrounding("\"")
                
                mutablePreferencesOf(
                    CONFIG_KEY to config
                )
            }
        )
    }
)
```

Preferences DataStore は SharedPreferences に似た API を提供しているが Protocol Buffers 形式で保存されるため、SharedPreferences の XML パースに起因する改行文字バグは発生しない。移行後は wrapping 不要。

### 2. 型の不一致

SharedPreferences は型がゆるいので、間違った型で保存されていることがある。

```kotlin
// Int として保存したつもりが String で保存されてた…
class MigrationFactory {
    fun create(context: Context): DataStoreMigration<Preferences> {
        return object : DataStoreMigration<Preferences> {
            override suspend fun migrate(currentData: Preferences): Preferences {
                val prefs = context.getSharedPreferences("settings", Context.MODE_PRIVATE)
                
                return currentData.toMutablePreferences().apply {
                    // 型変換しながら移行
                    val countStr = prefs.getString("view_count", "0")
                    this[VIEW_COUNT] = countStr?.toIntOrNull() ?: 0
                }.toPreferences()
            }
            
            override suspend fun shouldMigrate(currentData: Preferences): Boolean {
                // まだ移行してない場合のみ
                return !currentData.contains(MIGRATION_COMPLETED)
            }
            
            override suspend fun cleanUp() {
                // 移行完了後、古い SharedPreferences を削除
                context.getSharedPreferences("settings", Context.MODE_PRIVATE)
                    .edit().clear().commit()
            }
        }
    }
}
```

### 3. 破損データの処理

DataStore は破損に強いけど、念のため CorruptionHandler を設定する。

```kotlin
private val Context.dataStore by preferencesDataStore(
    name = "user_preferences",
    corruptionHandler = ReplaceFileCorruptionHandler { exception ->
        Log.e("DataStore", "Corruption detected", exception)
        
        // デフォルト値で初期化
        PreferencesFactory.createDefault()
    },
    produceMigrations = { context ->
        listOf(SharedPreferencesMigration(context, "user_prefs"))
    }
)
```

## テスト可能な移行

移行ロジックをテストできるように、ファクトリパターンを使う。まあファクトリパターンである必要は全く無いけど、とにかくテスタブルな形にしておく。

```kotlin
// 移行ファクトリー（テスト可能）
class PreferencesMigrationFactory @Inject constructor() {
    
    fun createMigration(
        context: Context,
        oldPrefsName: String
    ): DataStoreMigration<Preferences> {
        return SharedPreferencesMigration(
            context = context,
            sharedPreferencesName = oldPrefsName,
            migrate = { sharedPrefs ->
                migratePreferences(sharedPrefs)
            }
        )
    }
    
    // テスト可能な純粋関数
    internal fun migratePreferences(
        sharedPrefs: SharedPreferencesView
    ): Preferences {
        return mutablePreferencesOf().apply {
            // ユーザー設定
            sharedPrefs.getString("user_id", null)?.let {
                this[USER_ID] = it
            }
            
            // テーマ設定（文字列 → enum）
            val themeStr = sharedPrefs.getString("theme", "system")
            this[THEME] = when (themeStr) {
                "light" -> Theme.LIGHT.name
                "dark" -> Theme.DARK.name
                else -> Theme.SYSTEM.name
            }
            
            // 通知設定
            this[NOTIFICATIONS_ENABLED] = sharedPrefs.getBoolean("notifications", true)
        }.toPreferences()
    }
}

// テスト
@Test
fun `test theme migration`() {
    val mockPrefs = MockSharedPreferencesView().apply {
        putString("theme", "dark")
    }
    
    val migrated = factory.migratePreferences(mockPrefs)
    
    assertThat(migrated[THEME]).isEqualTo(Theme.DARK.name)
}
```

## 実装のコツ

### 1. 段階的な移行

全部一気に移行するんじゃなくて、機能ごとに段階的にやることも可能。しかし SharedPreferences からの移行をシュッとやってくれる `SharedPreferencesMigration` があるので、DataStore より上のレイヤーで移行実装が間に合わない、とかない限りはあんまりやらないほうがいいと思う。

```kotlin
// Phase 1: 新機能は DataStore で実装
class NewFeatureSettings(context: Context) {
    private val dataStore = context.newFeatureDataStore
    // DataStore のみ使用
}

// Phase 2: 読み取りを DataStore に移行
class UserSettings(context: Context) {
    private val dataStore = context.userDataStore
    private val legacyPrefs = context.getSharedPreferences("user", Context.MODE_PRIVATE)
    
    // 読み取りは DataStore から
    val userId: Flow<String?> = dataStore.data.map { it[USER_ID] }
    
    // 書き込みは両方に（移行期間中）
    suspend fun setUserId(id: String) {
        dataStore.edit { it[USER_ID] = id }
        legacyPrefs.edit().putString("user_id", id).apply()
    }
}

// Phase 3: 完全移行
class UserSettings(context: Context) {
    private val dataStore = context.userDataStore
    // DataStore のみ使用
}
```

### 2. Flow の活用

DataStore の最大のメリットは Flow での監視。Kotlin Coroutines にネイティブで対応してるのは大変ありがたい。

```kotlin
// ViewModel での使用例
class SettingsViewModel @Inject constructor(
    private val settingsDataStore: SettingsDataStore
) : ViewModel() {
    
    // 設定の変更を自動的に UI に反映
    val uiState: StateFlow<SettingsUiState> = combine(
        settingsDataStore.theme,
        settingsDataStore.notificationsEnabled,
        settingsDataStore.fontSize
    ) { theme, notifications, fontSize ->
        SettingsUiState(
            theme = theme,
            notificationsEnabled = notifications,
            fontSize = fontSize
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = SettingsUiState()
    )
}
```

### 3. Proto DataStore への移行も検討

さらに型安全にしたい場合は Proto DataStore も選択肢。Preferences DataStore は `.preferences_pb` ファイルだけど、Proto DataStore は `.pb` ファイルで、より構造化されたデータを扱える：

```protobuf
// user_preferences.proto
syntax = "proto3";

option java_package = "com.example.app.data";

message UserPreferences {
    string user_id = 1;
    Theme theme = 2;
    bool notifications_enabled = 3;
    
    enum Theme {
        SYSTEM = 0;
        LIGHT = 1;
        DARK = 2;
    }
}
```

```kotlin
// 使用例
private val Context.userDataStore by dataStore(
    fileName = "user_preferences.pb",
    serializer = UserPreferencesSerializer
)

// 型安全な読み書き
val theme: Flow<Theme> = context.userDataStore.data
    .map { it.theme }
```

## まとめ

SharedPreferences から DataStore への移行、最初は面倒に感じたけど、移行ツールが充実してて意外とスムーズだった。特に下記のメリットはだいぶうれしい。

- 自動移行で既存データを保持
- Flow で変更監視が簡単に
- 型安全性が向上
- テストしやすい設計に

ただし、[改行文字バグの workaround](/posts/2024/2024-11-11-android-sharedprefs-newline-spaces) とか型の不一致とか、レガシーコードの罠には注意。移行前にしっかりテストを書いておくのが大事。

次は Proto DataStore への移行も検討中…でもまあ、Preferences DataStore で充分な気もしている。
