---
layout: post
title: Gradleのall.zipを一発で取得する
category: programming
tags:
  - til
  - gradle
---

普通に`gradlew wrapper --gradle-version=x.y.z`とコマンドを叩くと、取得されるGradleのzipファイルは`gradle-x.y.z-bin.zip`。`all.zip`を取得するにはAndroidStudionおサジェストに従うか、あるいは`gradle-wrapper.properties`を修正する必要がある。

最初からコマンドラインで`gradle-x.y.z-all.zip`を取得するには`build.gradle`ファイルに一手間必要

```gradle
// rootのbuild.gradle
task wrapper(type: Wrapper) {
  gradleVersion = "x.y.z"
  distributionType "ALL"
}
```

これで`gradlew wrapper`を実行すると、`gradle-wrapper.properties`も`gradle-wrapper.jar`も`gradlew`も、一通り一度で更新される。

Gradleの該当コードは[このあたり](https://github.com/gradle/gradle/blob/2a858684ee64e589d35d8a48da5b9c17a238385d/subprojects/build-init/src/main/java/org/gradle/api/tasks/wrapper/Wrapper.java#L311-L314)

`gradlew wrapper --gradle-version=x.y.z --distribution-type=ALL`とかやっても同じ動作になりそう。
