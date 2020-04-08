---
layout: post
title: "(KMP) 'ERROR: Cause: invalid type code: 00' が出たときにすること"
category: programming
tags:
  - kotlin
  - til
  - kmp
---

IntelliJ IDEAでKotlin Multiplatform Projectを開くと、たまにこんなエラーでGradle Projectの同期に失敗することがある。

```
Cause: invalid type code: 00
New Gradle Sync is not supported due to containing Kotlin Module
```

エラーメッセージからはなんのことやらよくわからないのだけれど、対処方法は簡単。

IntelliJの `Preferences` を開いて、`Experimental > Gradle > Only sync the active variant` を無効にするだけだ。

## 参考
- [MPP, IDE: "ERROR: Cause: invalid type code: 00" on project import in MPP with Android target with Gradle JDK 1.8 : KT-34997](https://youtrack.jetbrains.com/issue/KT-34997)
