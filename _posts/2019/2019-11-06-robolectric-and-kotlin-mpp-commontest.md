---
layout: post
title: (Kotlin MPP) commonTestをRobolectricで実行する
category: programming
tags:
  - kotlin
---

AndroidXの`androidx.test.ext:junit`を利用するとサクッとできます。

基本的な方針は、Kotlin/Native向けにcommonTestを実行するときはkotlin-testを使いつつ、Android向けに実行するときはJUnit4上でRobolectricを使います。

ちなみにcommonTestのテストクラスはこんな感じになります。

```kotlin
@RunWith(AndroidJunit4::class)
class SomeTest {

    @BeforeTest
    fun setup() {}

    @AfterTest
    fun tearDown() {}

    @Test
    fun `It should do something() {}
}
```

この`RunWith`や`AndroidJUnit4`を作っていきます。


まずはライブラリの追加。
commonTestでは`kotlin-test`を読み込みつつ、androidTestでは`kotlin-test`と`androidx.test.ext:junit`や`Robolectric`を読み込んでいく。iosTestは特に必要ありません。

```gradle
kotlin {
    android()
    iosX64("ios") {
        binaries {
            framework()
        }
    }

    sourceSets {
        commonMain {}
        commonTest {
            dependencies {
                implementation "org.jetbrains.kotlin:kotlin-test-common:1.3.51"
                implementation "org.jetbrains.kotlin:kotlin-test-annotations-common:1.3.51"
            }
        }

        androidMain {}
        androidTest {
            dependencies {
                implementation "org.jetbrains.kotlin:kotlin-test:1.3.51"
                implementation "org.jetbrains.kotlin:kotlin-test-junit:1.3.51"
                implementation "androidx.test:core:1.2.1-alpha02"
                implementation "androidx.test.ext:junit:1.1.2-alpha02"
                implementation "org.robolectric:robolectric:4.3.1"
            }
        }

        iosMain {}
        iosTest {}
    }
}
```

まず共通部分のexpect定義

```kotlin
// commonTest
import kotlin.reflect.KClass

expect annotation class RunWith(val value: KClass<out Runner>)
expect abstract class Runner
expect class AndroidJUnit4 : Runner
```

次にAndroid向けのactual定義。
junitやandroidxの該当クラスへのtypealiasです。

```kotlin
// androidTest
actual typealias RunWith = org.junit.runner.RunWith
actual typealias Runner = org.junit.runner.Runner
actual typealias AndroidJUnit4 = androidx.test.ext.junit.runners.AndroidJUnit4
```

最後にiOS向けのactual定義

```kotlin
// iosTest
import kotlin.reflect.KClass

actual annotation class RunWith(actual val value: KClass<out Runner>)
actual abstract class Runner
actual class AndroidJUnit4 : Runner()
```

iOS側の定義は見てわかるように、単純なプレースホルダです。
iOS向けのcommonTestはiOSシミュレータ上で実行されるので(そういうGradleタスクを書く必要はありますが)特にRobolectric的なものは必要ありません。

androidTestは、instrumentation testのような顔をしていますがjvm上で動くためRobolectricが必要になります。

ここで使っている`androidx.test.ext.junit.runners.AndroidJUnit4`はクロスプラットフォーム対応のテストランナーで、実行環境に応じてテストランナーをいい感じに切り替えてくれます。jvm環境だったら勝手に`RobolectricTestRunner`を使ってくれるスグレモノです。

あとは適当にテストケースを書いて、`androidTest/resources/your/package/robolectric.properties`に諸々Robolectricの設定を書いていけば終わりです。

`./gradlew testDebugUnitTest`とかやったらRobolectricを使ってcommonTestのテストケースが実行されます。

このコードは別モジュールに切り出してテスト用ライブラリとして運用するとよさそうです。
