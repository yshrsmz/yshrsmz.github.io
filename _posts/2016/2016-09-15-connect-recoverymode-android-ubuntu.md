---
layout: post
title: Recovery/FastbootモードのAndroid端末をUbuntuに認識させる 
category:
  - programming;
tags:
  - android
  - ubuntu
---

普通に起動してるぶんには何もしなくても`adb devices`で認識してくれてたけど、OTA zipをsideloadしようと思ってリカバリモードで起動したら`Permission 普通に起動してるぶんには何もしなくても`adb devices`で認識してくれてたけど、OTA zipをsideloadしようと思ってリカバリモードで起動したら`Permission denied`的なエラーが出て認識してくれなかった。

調べてみたら`udev`の設定が必要なようだった。  
手順としては下記の通り。

#### 1. リカバリモードで起動

```
$ adb reboot recovery
```

#### 2. `lsusb`で端末のidを取得

```
$ lsusb
> Bus 002 Device 009: ID 18d1:4ee2 Google Inc. Nexus 4 (debug)
```
この場合、`18d1`がidVendorで、`4ee2`がidProduct。

#### 3. 上記手順でわかったidで`/etc/udev/rules.d/51-android.rules`をつくる

```
SUBSYSTEM=="usb", ATTR{idVendor}=="18d1", ATTR{idProduct}=="4ee2", MODE="0666", GROUP="usergroup"
```

GROUPには適当なUnixグループを指定すること。GROUPの代わりに`OWNER={ユーザ名}`でもいいみたい。

#### 4. chmodする

```
$ chmod a+r /etc/udev/rules.d/51-android.rules
```

以上。

参考:

- [ハードウェア端末上でアプリを実行する](https://developer.android.com/studio/run/device.html#setting-up)
- [ADB can discover devices but not fastboot](http://android.stackexchange.com/questions/58187/adb-can-discover-devices-but-not-fastboot)
