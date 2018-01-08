---
layout: post
title: (Android) 端末にインストールされているアプリのAPKファイルを取得する
categories:
  - android
tags:
  - android
---

要ADB。  
ADBさえ入っていれば、わりと簡単にゲットすることができます。
端末をPCにつないで、下記のコマンドを実行するだけです

```
$ adb shell pm list packages
$ adb shell pm path com.example.someapp
$ adb pull /path/to/target/app
```

軽くコマンドの説明をします。

### 1.  `adb shell pm list packages`

端末に入ってるアプリのパッケージ名一覧を取得しています。  
この中から、自分が取得したいアプリのパッケージ名を探しだしてください。

### 2. `adb shell pm path com.example.someapp`  

`com.example.someapp`には、1で取得したパッケージ名を入れてください。  
指定したパッケージの端末内でのフルパスを取得しています。

### 3. `adb pull /path/to/target/app`

`/path/to/target/app`には、2で取得したパッケージのフルパスを入れてください。  
おそらく、`/data/app/`から始まるパスです。

このコマンドで、端末からPCにAPKをダウンロードしています。

こちらからは以上です。

参考: [adb - How do I get an apk file from an Android device? - Stack Overflow](http://stackoverflow.com/questions/4032960/how-do-i-get-an-apk-file-from-an-android-device)


## ※ 2017/04/13補足

上記の方法だとAndroid 7以降で、 `adb pull` するときに `adb: error: remote object '/path/to/target/app' does not exist` とか怒られてしまいます。  
権限周りの変更があったんだと思いますが、下記のように一度Downloadディレクトリ等アクセス権のある場所にコピーしてからだと `adb pull` できます。

```
adb shell cp /path/to/target/app/base.apk /storage/emulated/0/Download
adb pull /storage/emulated/0/Download/base.apk
```

