---
layout: post
title: ChromeExtensionをウェブストアに公開する
categories:
  - programming
tags:
  - chrome-extension
---

[ChromeのOmniboxからTwitterに投稿するやつ](https://chrome.google.com/webstore/detail/omnitweety/jkghejckpigfbolkdkplfokccgpjjilb)を作った時に調べたのでまとめておく。

## 1. 開発者登録

まずは開発者登録が必要。  
[Chromeウェブストア](https://chrome.google.com/webstore/category/apps)にアクセスし、右上のメニューから「[ディベロッパーダッシュボード](https://chrome.google.com/webstore/developer/dashboard)」へ。  
開発者登録には5ドル必要なので、まずは粛々と5ドル払う。  
同じページの下の方で、ディベロッパーアカウントの表示名等を変えられるので必要に応じて編集する。

## 2. 拡張機能をアップロード

作成した拡張機能をzipで圧縮してアップロード。  
ディベロッパーダッシュボードの「新しいアイテムを追加する」ボタンからアップロードできる。  
アップロードすると、いろいろ詳細情報を記入するページへ遷移するので、必要な箇所を適当に埋めましょう。  
入力が終わったら一番下の「公開」ボタンを押せば、公開されます。
