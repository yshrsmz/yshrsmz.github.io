---
layout: post
title: Windowsでnode.jsを動かすには
category:
  - programming
tags:
  - windows
  - nodejs
---


Electronの案件でWindows使う必要が出てきて、Node.jsのインストール周りで躓いたのでメモなど。
(正確にはnode-gypでmoduleビルドするときに躓いた)

## 1. [Chocolatey](https://chocolatey.org/)のインストール

いつの間にかWindowsにもHomebrewやapt-getのようなパッケージ管理ツールが登場しています。  
まずはこれインストールしときましょう。

管理者モードでコマンドプロントを開き、下記のコマンドをコピペして実行しましょう。

```
@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))" && SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin
```

Powershell使ってる場合はこっちです↓

```
iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))
```

処理が終わったらコマンドラインを再起動すると、`choco`コマンドが使えるようになってます。  
詳しくはChocolateyのドキュメント見てね！


## 2. Node.jsのインストール

ChocolateyでNode.jsをインストールします。
これも管理者モードで実行しましょう。Chocolateyは基本管理者モードで実行したほうがいいみたい。

```
choco install nodejs
```

## 3. Python2.xのインストール

node-gypで使ってるpythonが2.x系のようなので(2015/6/17時点)、これもChocolateyでインストールします

```
choco install python2
```

## 4. Miconsoft Visual Studio Express 2013のインストール 

ビルドツールの関係でこれもインストールする必要があります。
私はMicrosoftのページから`Microsoft Visual Studio Express 2013 for Windows Desktop Update 4`を探してきてインストールしたらビルドが通るようになりました。最新のnode-gypなら2013以降のvisual studioでも動くはず。  
また、Chocolatey上にもパッケージがあるので、それ使ってもいいかもしれません(検証してない)

```
choco installvisualstudioexpress2013windowsdesktop
```


これでネイティブのモジュールもビルドできるようになる、はず。  

こちらからは以上です。

参考: http://stackoverflow.com/questions/21365714/nodejs-error-installing-with-npm#answer-21366601
