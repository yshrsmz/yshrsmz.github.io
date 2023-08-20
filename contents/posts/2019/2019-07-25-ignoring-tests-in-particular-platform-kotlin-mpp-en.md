---
layout: post
title: (KMP) Ignore some commonTests in a specific platform
category: programming
tags:
  - kotlin
  - kmp
  - english
---

In Kotlin Multiplatform Project, it is common to write tests in `commonTest`, as you can run it on all platforms you configured. However, while you want to make test "common" as much as you can, there might be some test cases you can't run on some specific platform. So, what to do?

A very naive way is to move those "non-common" test cases to platform-specific test directories. It is okay if you only target two platforms, but what if you want 3 or more target platforms? I don't think it's a good practice to have the same test cases in several platform-specific test directories.

So here's the thing. Kotlin Multiplatform Project has 'expect/actual mechanism', with which you can provide platform-specific declarations. With this, you can declare custom `@Ignore` annotation, which selectively ignores test cases on specific platforms.

Assume you have 2 target platforms; Android and iOS.   
You want to create an annotation which tells test runner to ignore the annotated cases/classes on iOS.

First, you need to need the 'expect' declaration in common code.

```kotlin
// commonMain
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
expect annotation class IgnoreIos
```

Then you need to write corresponding 'actual' declarations in each platform.

```kotlin
// androidMain
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
actual annotation class IgnoreIos
```

```kotlin
// iosMain
actual typealias IgnoreIos = kotlin.test.Ignore
```

The key point here is in iOS 'IgnoreIos' is a typealias for `kotlin.test.Ignore`, but it's just a useless annotation in Android. So it works as `kotlin.test.Ignore` in iOS but does nothing in Android.
