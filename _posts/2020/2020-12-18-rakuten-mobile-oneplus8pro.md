---
layout: post
title: 楽天モバイルをAndroid11なOnePlus 8 Proで使う
category: diary
tags:
  - diary
  - android
  - TIL
---


普通にSIMさしてAPN設定しただけでは通信できるようにならない

項目 | 値
---|---
APN名 | 楽天(rakuten.jp)
APN | rakuten.jp
MCC | 440
MNC | 11
APNタイプ | default,supl,dun
APNプロトコル | IPv4/IPv6
APNローミングプロトコル | IPv4/IPv6
PDPタイプ | IPv4/IPv6

PDPタイプに関してはOnePlus8Proに入力欄はない

この設定をしたあと、追加で下記も必要

1. 電話アプリを起動
2. `*#*#4636#*#*`を入力し、「テスト中」モードに入る
3. 「携帯電話情報」をタップ
4. 「優先ネットワークの設定」から「LTE only」を選択

以上で通信が可能になる。

たまに設定がリセットされることもあるらしい。
