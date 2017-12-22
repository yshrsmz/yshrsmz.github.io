---
layout: page
title: 趣味アプリをMVPからMVVMに書き換えて更にKotlin化した話
tags:
  - android
  - kotlin
---

[Android Advent Calendar 2017](https://qiita.com/advent-calendar/2017/android)の24日目です。

2年ほど前(2015年)に個人で作ったAndroidアプリを、ふと思い立って完全リファクタリングすることにした。
理由はいくつかあるけれど、主なところでは下記の三点だ。

- Kotlin
- Android CleanArchitectureを写経するくらいの感じで作ったが、見返してみるといらないコードが多い
- 最近はMVPよりMVVMが好き
