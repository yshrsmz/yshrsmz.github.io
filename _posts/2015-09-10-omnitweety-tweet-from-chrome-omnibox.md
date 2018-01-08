---
layout: post
title: 最強のTwitterクライアント…ではないけど、URL共有特化Chrome Extension作った
category:
  - programming
tags:
  - chrome-extension
  - javascript
  - twitter
  - omnitweety
---

世間ではElectron使った「最強のTwitterクライアント」開発戦争が勃発していますね。

それに触発された、というわけでもありませんが、Chrome用のTwitter投稿Extension作ったので紹介します。  
"[Omnitweety](https://chrome.google.com/webstore/detail/omnitweety/jkghejckpigfbolkdkplfokccgpjjilb)"と言います。

## 機能紹介

Omnitweetyは、ChromeのOmnibox(アドレスバー)からの投稿を可能にするだけの、シンプルなTwitterクライアントです。
機能は下記の3つです。

- Omniboxから投稿
- Omniboxから、今見ているサイトのURLを投稿
- Omniboxから、今見ているサイトのURLをコメント付きで投稿

### 1. Omniboxから投稿

![tweet from omnibox](https://raw.githubusercontent.com/yshrsmz/omnitweety/master/store_assets/omnitweety_screenshot1.png)

Omniboxにフォーカスをあわせて(Macだと `Cmd+L` でOmniboxにフォーカスが移動します)、`tw + tab/space` と入力すると、Omniboxの入力モードになります。  
続けて文字を入力すると、サジェストエリアの一番上に残り文字数が表示されます。  
最後にEnterを押すと、Twitterに投稿されます(成功するとNotificatinが表示されます)。


### 2. Omniboxから、今見ているサイトのURLを投稿

![tweet url from omnibox](https://raw.githubusercontent.com/yshrsmz/omnitweety/master/store_assets/omnitweety_screenshot2.png)

`tw+tab/space` で Omnitweetyの入力モードに入ったあと、 `:share` と入力すると、現在表示中のタブ情報を取得し、 `NowBrowsing: {title} {url}` のフォーマットで投稿できるようになります。  
タイトルが長すぎる場合は140字ちょうどになるよう、適当に丸めます。(一応`t.co`の短縮URL使用後の文字数を見ているので、極端にタイトルが短くなりすぎることはないと思います。)

### 3. Omniboxから、今見ているサイトのURLをコメント付きで投稿

![tweet url with comment](https://raw.githubusercontent.com/yshrsmz/omnitweety/master/store_assets/omnitweety_screenshot3.png)


上記の `:share` コマンドのあとに半角スペースを挟んで何か入力すると、入力した内容が `NowBrowsing` を置換します。
コメントが長くなると、共有ページのタイトルを削っていきます。長くなりすぎるとツイートに失敗します。


機能は以上です。

## 今後の展望

ひと通り自分のほしい機能は実装しましたが、まだいくつか改善したいと思っている点があります。  
機会を見つけて改善していきたい。

- コメント付きでシェアするときの残り文字数表示
- URLシェア時のプレフィックスを編集可能にする
- 任意のタイミングでTwitterにログインさせる(今はインストール時のみ)

## Open Source!

https://github.com/yshrsmz/omnitweety  

Omnitweetyのソースコードは[Github](https://github.com/yshrsmz/omnitweety)で公開しています。  
issue/pull requestもお気軽にどうぞ


### リンク

- [Omnitweety - Chrome ウェブストア](https://chrome.google.com/webstore/detail/omnitweety/jkghejckpigfbolkdkplfokccgpjjilb)
- [yshrsmz/omnitweety](https://github.com/yshrsmz/omnitweety)
