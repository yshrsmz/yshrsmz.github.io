---
layout: post
title: Gradleの更新時にall.zipを一発で取得する
category: programming
tags:
  - til
  - gradle
---

普通に`gradlew wrapper --gradle-version=x.y.z`とコマンドを叩くと、取得されるGradleのzipファイルは`gradle-x.y.z-bin.zip`。`all.zip`を取得するにはAndroidStudioのサジェストに従うか、あるいは`gradle-wrapper.properties`を修正する必要がある。

最初からコマンドラインで`gradle-x.y.z-all.zip`を取得するには`build.gradle`ファイルに一手間必要

```gradle
// rootのbuild.gradle
task wrapper(type: Wrapper) {
  gradleVersion = "x.y.z"
  distributionType "ALL"
}
```

まあこれを設定しても今まで通り`wrapper`タスクを二度実行する必要があるのは変わらないけど、コマンドは短くなるし`all.zip`を取得し直す手間もなくなる。

Gradleの該当コードは[このあたり](https://github.com/gradle/gradle/blob/2a858684ee64e589d35d8a48da5b9c17a238385d/subprojects/build-init/src/main/java/org/gradle/api/tasks/wrapper/Wrapper.java#L311-L314)

`gradlew wrapper --gradle-version=x.y.z --distribution-type=ALL`とかやっても同じ動作になりそう。


### 2018/07/04追記

上の方法、Gradle5.0から使えなくなるらしく実行時に警告が出るようになっていた。

```
Deprecated Gradle features were used in this build, making it incompatible with Gradle 5.0.
See https://docs.gradle.org/4.8.1/userguide/command_line_interface.html#sec:command_line_warnings
```

上記のようなメッセージが表示されるのみで最初はわからなかったんだけど、表示されるリンク先にあるように `--warning-mode=all` を指定して適当なタスクを実行してみたら詳細なエラーがでた。

```
Creating a custom task named 'wrapper' has been deprecated and is scheduled to be removed in Gradle 5.0. You can configure the existing task using the 'wrapper { }' syntax or create your custom task under a different name.'.
        at build_b74mo1uay274dql3ctg39y5sg.run(/Users/user_name/repos/some_project/build.gradle:38)
        (Run with --stacktrace to get the full stack trace of this deprecation warning.)
```

なるほど。

```
wrapper {
    gradleVersion = '4.8.1'
    //noinspection UnnecessaryQualifiedReference
    distributionType = Wrapper.DistributionType.ALL
}
```

みたいに変更したらメッセージは消えた。

