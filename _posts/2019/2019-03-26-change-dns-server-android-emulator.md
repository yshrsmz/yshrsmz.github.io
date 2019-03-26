---
layout: post
title: MacでAndroidエミュレータのDNSサーバを変える
category: programming
tags:
  - android
  - mac
---

Androidエミュレータのhostsを変えるのはちょっと手間なので、ローカルでDNSサーバをたててなんとかしてみる。

dnsmasqというツールを使う。

## dnsmasqのインストール/設定

```
$ brew install dnsmasq
```

`/etc/dnsmasq.hosts` を作成。

dnsmasqで使っていくhostsファイル。
Mac自身で使う必要はないので別に用意する。
記法は普通のhostsファイルと同じ。


`/usr/local/etc/dnsmasq.conf` に下記を追加。

```
# dnsmasqだけで使うhostsファイル
addn-hosts=/etc/dnsmasq.hosts
# ログを出力したければ下記を追加。
# パスは任意の場所で構わない。先にディレクトリを作っておくこと
log-queries
log-facility=/usr/local/var/log/dnsmasq/dnsmasq.log
```

## dnsmasqの起動

```
$ sudo brew services start dnsmasq
```

## Androidエミュレータの起動

DNSサーバを設定するためコマンドラインから起動する

```
$ emulator -avd AVD_NAME -dns-server 127.0.0.1
```

エミュレータの名前は `$ emulator -list-avds` で取得できる。

```
PANIC: Missing emulator engine program for 'x86' CPU.
```
が出る場合は違うコマンドを参照している。
PATHに`$ANDROID_HOME/emulator`を追加すること。その際、`$ANDROID_HOME/tools`より先に記述する。
