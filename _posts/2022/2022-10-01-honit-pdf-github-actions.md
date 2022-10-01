---
layout: post
title: GitHub Actions 上で HonKit の PDF を出力する
category: programming
tags:
  - GitHub Actionss
  - HonKit
---

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">いままでWordで管理されてた提携先企業に渡す仕様書をMarkdownに書き換えて、CIでPDF出力するように変えたった。今日はいい仕事した気がする…。ありがとうHonKit</p>&mdash; せーい (@_yshrsmz) <a href="https://twitter.com/_yshrsmz/status/1574763490493235203?ref_src=twsrc%5Etfw">September 27, 2022</a></blockquote>

これ。

---

[HonKit](https://github.com/honkit/honkit) はOSSでなくなった [Gitbook](https://github.com/GitbookIO/gitbook) をフォークして作られた OSS ソフトウェア。

HonKit の PDF 出力は [Calibre](https://calibre-ebook.com/) という Ebook 管理ソフトを利用しているので、これのインストールが必要。[公式でインストール用の Shell スクリプトを公開している](https://calibre-ebook.com/download_linux)ので、それを使えばよい。

また、 GitHub Actions はそのままだと日本語フォントがインストールされていないので、こちらも追加で対応が必要。

最終的な設定はこんな感じになる。

```yml
name: build PDF

on:
  workflow_call:

jobs:
  publish-pdf:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version-file: '.node-version'
          cache: 'npm'

      - name: Install Node.js dependencies
        run: npm install

      - name: Install Calibre
        run: |
          sudo -v
          sudo apt-get update -y && sudo apt-get install -y libegl1 libopengl0 fonts-noto
          wget -nv -O- https://download.calibre-ebook.com/linux-installer.sh | sudo sh /dev/stdin

      - name: Generate PDF
        run: npx honkit pdf ./ ./output.pdf

      - name: Upload PDF
        uses: actions/upload-artifact@v3
        with:
          name: documents
          path: ./output.pdf
```

`Install Calibre` のステップで、日本語フォントに加えて `libegl1` と `libopengl0` をインストールしている。これらをインストールしないと、下記のようなエラーが出て Calibre のインストールに失敗する。

> You are missing the system library libEGL.so.1. Try installing packages such as libegl1 and libopengl0
