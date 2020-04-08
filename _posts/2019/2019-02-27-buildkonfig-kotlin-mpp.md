---
layout: post
title: Kotlin Multiplatform Project向けのBuildConfig、BuildKonfigを作った
category: programming
tags:
  - kotlin
  - kmp
---

[BuildKonfig](https://github.com/yshrsmz/BuildKonfig)という、Kotlin Multiplatform Projectでも`build.gradle`からコードに値を埋め込めるGradle Pluginを作った。

これは名前からもわかるように、Androidの`BuildConfig`から着想を得ている。  
Androidでは`build.gradle`から`BuildConfig`に任意のフィールドを追加することができる。これがすごく便利で、だいたいレポジトリに含みたくないAPIトークンとか、あるいはフレーバーごとに切り替えたい定数をコードに埋め込むために使われているんじゃないかと思う。

ただ、Kotlin Multiplatform Projectでは今の所、これに相当する機能は提供されていない。

ないものは作ってしまえということで、BuildKonfigが出来上がった。


## 使い方

Kotlinは1.3.20以降をサポートしている。  
Gradleは4.10とかでも動くはずだけど、5.1.1以降を推奨。  
あとMultiplatform Projectでないと動きません。


```gradle
// ./build.gradle
buildScript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:1.3.21'
        classpath 'com.codingfeline.buildkonfig:buildkonfig-gradle-plugin:0.3.1'
    }
}
```


```gradle
// ./common/build.gradle
apply plugin: 'org.jetbrains.kotlin.multiplatform'
apply plugin: 'com.codingfeline.buildkonfig'

kotlin {
    // KMPのターゲット設定
    android()
    iosX64('ios')
}

buildkonfig {
    // BuildKonfigのパッケージ
    packageName = 'com.example.app'
    
    // デフォルト設定
    defaultConfigs {
        // buildConfigField(type, name, value)
        // 型はString, Int, Long, Float, Booleanをサポート
        buildConfigField 'STRING', 'name', 'value'
    }
    
    targetConfigs {
        // ターゲット名と同じキーで設定
        android {
            buildConfigField 'STRING', 'name2', 'value2'
        }
        
        ios {
            buildConfigField 'STRING', 'name', 'valueForNative'
        }
    }
}
```

Kotlin Multiplatform ProjectにはAnnotation Processorが存在しないので、コード生成をしようと思うとGradle Pluginを書くことになる。

`generateBuildKonfig`タスクを実行すると、下記の３つのファイルが生成される。commonと、各ターゲット用のコードだ。  
また、各ビルドタスクに依存関係を設定してあるので、再ビルドすると生成されるはず。

```kotlin
// commonMain
package com.example.app

expect object BuildKonfig {
    val name: String
}
```

```kotlin
// androidMain
package com.example.app

actual object BuildKonfig {
    actual val name: String = "value"
    val name2: String = "value2"
}
```

```kotlin
// iosMain
package com.example.app

actual object BuildKonfig {
    actual val name: String = "valueForNative"
}
```

ご覧の通りexpect-actualで生成しているので、iOSとAndroidで値を変えるなんていうのもできる。  
また、特定のターゲットだけ追加のフィールドがほしいというユースケースにも対応できる(もちろんcommonのソースセットからは使えないけど)。

### プロダクトフレーバー
あとはちょっとトリッキーだけど、プロダクトフレーバー的な機能も提供している。  

実はKotlin Multiplatform Projectにはプロダクトフレーバーやビルドタイプといった機能は存在しない。  
AndroidターゲットはAndroid Gradle Plugin側の設定から推移的に解決されるフレーバーがあり、Kotlin/NativeターゲットにはRelease/Debugの区別はあるけど、全体的なDebug/Releaseやフレーバーはサポートされていない。

なのでBuildKonfigで提供しているフレーバー機能は、プロパティを切り替えることで実現する。

まずはプロジェクトルートの`gradle.properties`にデフォルトのフレーバーを設定。

```
buildkonfig.flavor=dev
```

次に`build.gradle`でフレーバー毎のbuildkonfig設定を記述する。

```gradle
buildkonfig {
    packageName = 'com.example.app'
    
    // default configは必須
    defaultConfigs {
        buildConfigField 'STRING', 'name', 'value'
    }
    // 第一引数がフレーバー
    defaultConfigs("release") {
        buildConfigField 'STRING', 'name', 'releaseValue'
    }
    
    targetConfigs {
        android {
            buildConfigField 'STRING', 'name2', 'value2'
        }
        
        ios {
            buildConfigField 'STRING', 'name', 'valueIos'
        }
    }
    // 第一引数がフレーバー
    targetConfigs("release") {
        ios {
            buildConfigField 'STRING', 'name', 'releaseValueIos'
        }
    }
}
```

この設定でビルドすると、`buildkonfig.flavor=dev`でかつ`dev`フレーバーな設定は存在しないので、`defaultConfigs`と`targetConfigs`から`BuildKonfig`が生成される。もちろんちゃんと`dev`フレーバーを設定してもいい。

`buildkonfig.flavor=release`に書き換えると、今度は`defualtConfigs("release")`と`targetConfigs("release")`も考慮して`BuildKonfig`が生成される。

値は下記の順で優先される。

```
targetConfigs("flavor") > targetConfigs > defaultConfigs("flavor") > defaultConfigs
```

コマンドラインからフレーバーを書き換えるときは普通にプロパティを引数として与えてあげればいい。

```
$ ./gradlew assembleRelease -Pbuildkonfig.flavor=release
```


## そのほか

Kotlin Multiplatform Project周りはまだ色々整備されてないので今がチャンス！

## リンク

- [https://github.com/yshrsmz/BuildKonfig](https://github.com/yshrsmz/BuildKonfig)
