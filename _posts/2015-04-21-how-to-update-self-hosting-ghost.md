---
layout: post
title: (Ghost) セルフホスティングなGhostをアップデートする
categories:
  - programming
tags:
  - ghost
---

Ghostは月一回前後のスパンでアップデートをリリースしています。  
新しい機能やBugfix、脆弱性対応を取り入れるためにはできる限り頻繁にアップデートを反映していきたいものです。

今回はその手順を簡単に。

1. 新しいGhostのzipをダウンロードする
2. 作業フォルダに展開する
3. インストール済みのGhostからアップデート関連のファイルを削除する
4. 削除したファイルを作業フォルダに展開したアップデート用ファイルからコピーする
5. テーマの更新
6. 依存ライブラリの更新
7. パーミッションの更新
8. Ghostの再起動

### 1. 新しいGhostのzipをダウンロードする

[https://ghost.org/download/](https://ghost.org/download/) から最新のzipのURLを取得します。   
ちなみに、 [https://ghost.org/zip/ghost-latest.zip](https://ghost.org/zip/ghost-latest.zip) このURLで最新版がとれるみたいです。

URLがわかったら、適当な作業ディレクトリにダウンロードします。  
今回は`~/tmp/`にダウンロードします。

※ここでrootとかghost管理用ユーザとか、適切なアカウントに切り替えるのを忘れないように

```shell
$ curl -L https://ghost.org/zip/ghost-latest.zip -o ~/tmp/ghost.zip
```

### 2. 作業フォルダに展開する

ダウンロードしてきたzipファイルを解凍します。  
zipと同じ`~/tmp/`に展開します。

```shell
$ unzip -uo ~/tmp/ghost.zip -d ~/tmp/ghost
```


### 3. インストール済みのGhostからアップデート関連のファイルを削除する

Ghostインストールディレクトリから、下記のファイル・ディレクトリを削除します

- index.js
- package.json
- npm-shrinkwrap.json
- core/

```shell
$ cd /your/ghost/dir
$ rm index.js
$ rm package.json
$ rm npm-shrinkwrap.json
$ rm -rf core/
```

### 4. 削除したファイルを作業フォルダに展開したアップデート用ファイルからコピーする

`~/tmp/ghost`から、先ほど削除したファイル・ディレクトリと同名のものをコピーしてきます。

- index.js
- package.json
- npm-shrinkwrap.json
- core/

```shell
$ cd /your/ghost/dir
$ cp ~/tmp/ghost/index.js index.js
$ cp ~/tmp/ghost/package.json package.json
$ cp ~/tmp/ghost/npm-shrinkwrap.json npm-shrinkwrap.json
$ cp -r ~/tmp/ghost/core/ core/
```

### 5. テーマの更新

このタイミングで、必要であればテーマも更新しておきます。  
標準のCasperを使ってるのであれば、上記の要領で`content/themes/casper/`を削除＆コピーしてきましょう。

### 6. 依存ライブラリの更新

```shell
$ cd /your/ghost/dir
$ npm install --production
```

### 7. パーミッションの更新

ghost管理ユーザで作業してる場合は大丈夫ですが、違うユーザ使ってる場合はghostユーザに所有者変えときましょう

```shell
$ chown -R ghost:ghost /your/ghost/dir
```

## 8. Ghostの再起動

再起動します。  
daemon化の方法によっていろいろだと思うので各自いい感じにお願いします  
initスクリプト使ってる場合は

```shell
$ /etc/init.d/ghost restart
```

とか

```shell
$ service ghost restart
```

とかそんな感じで。


以上です。  
この作業もAnsibleで自動化しておくと捗りそうですね。

参考: [How to upgrade self-installed Ghost](http://support.ghost.org/how-to-upgrade/)
