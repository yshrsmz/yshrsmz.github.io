---
layout: post
title: Kotlin Multiplatform ProjectでKotlin 1.3.20に移行したら出力ファイル名が変わった件
category: programming
tags:
  - kotlin
---

[Kotlin 1.3.20がリリースされた](https://blog.jetbrains.com/kotlin/2019/01/kotlin-1-3-20-released/)ので、早速Kotlin MPP(Android/iOS)なプロジェクトでバージョンアップしてみた。

ほとんど考えることはないんだけど、一箇所、Kotlin MPPで対応プラットフォームを指定する箇所だけちょっと躓いた。

今まではターゲットは下記のように設定していた。

```gradle
kotlin {
    targets {
        fromPreset(presets.jvm, 'jvm')
        fromPreset(presets.iosX64, 'ios') {
          compilations.main.outputKinds('FRAMEWORK')
        }
    }
}

// iOSのビルド時に呼び出されるタスク
task copyFramework {
    def buildType = project.findProperty("kotlin.build.type") ?: "DEBUG"
    def target = project.findProperty("kotlin.target") ?: "ios"
    dependsOn kotlin.targets."$target".compilations.main.linkTaskName("FRAMEWORK", buildType)

    doLast {
        def srcFile = kotlin.targets."$target".compilations.main.getBinary("FRAMEWORK", buildType)
        def targetDir = getProperty("configuration.build.dir")
        copy {
            from srcFile.parent
            into targetDir
            include 'data.framework/**'
            include 'data.framework.dSYM'
        }
    }
}
```

`copyFramework`タスクのほうは参考にするドキュメントによって違うだろうけど、iOSアプリをビルドするときに呼ばれる、成果物のframeworkをコピーするものだ。

で、このあたりの設定を書き換えずにビルドすると、出力されるframeworkの名前が変わってしまう。  
今までは`${module名}.framework`だったのが、`main.framework`になってしまう。

iOS側の参照をすべて書き換えるのでも対応できなくはないけど、根本的な解決策ではないしちょっと気持ち悪い。

これの原因は1.3.20から導入された新しいDSLだ。  
ターゲットの設定方法を1.3.20からの新しいDSLに書き換えると下記のようになり、今まで通り`${module名}.framework`な成果物が得られる。  
ちなみにcopyタスクの方を書き換え忘れると存在しないタスクを参照しようとしてビルドが失敗する。

```gradle
kotlin {
  jvm()
  iosX64('ios') {
    binaries {
      framework()
    }
  }
}

task copyFramework {
    def buildType = project.findProperty("kotlin.build.type") ?: "DEBUG"
    def target = project.findProperty("kotlin.target") ?: "ios"
    // 上でframeworkにnamePrefixを設定した場合はその値を第一引数に与える
    def bin = kotlin.targets."$target".compilations.main.target.binaries.findFramework("", buildType)
    dependsOn bin.linkTask

    doLast {
        def srcFile = kotlin.targets."$target".compilations.main.target.binaries.findFramework("", buildType).outputFile
        def targetDir = getProperty("configuration.build.dir")
        copy {
            from srcFile.parent
            into targetDir
            include 'data.framework/**'
            include 'data.framework.dSYM'
        }
    }
}
```

このDSLの変更により、一つのターゲットに対して複数の成果物を設定することができるようになったらしい。

```gradle
kotlin {
  iosX64 {
    binaries {
      framework('foo')
      framework('bar') {
        export(project(":dependency"))
      }
    }
  }
}
```

例えば上みたいな書き方をすると、`foo.framework`と`bar.framework`が出力される。  
片方だけ特別な設定を加える、ということも可能だ。


