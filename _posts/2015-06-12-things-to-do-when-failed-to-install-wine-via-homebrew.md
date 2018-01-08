---
layout: post
title: HomebrewからWineをインストールできないときにすべきこと
categories:
  - programming
tags:
  - wine
  - homebrew
---

WineはUniversalバイナリなので、依存関係にあるformulaeを片っ端から`--universal`つきでインストールし直す必要があります。
また、依存するformulaeが依存するformulaeも`--universal`でインストールしなおさなければいけません。

細かい実行ログは

```shell
brew install wine -v
```

で確認できるので、エラーログ見ながら怪しそうなformulaeを片っ端から`--universal`でインストールし直すとよさそうです。

私の場合は

- fontconfig
- freetype
- gd
- jpeg
- libtiff
- libpng

この辺りのformulaeをインストールし直したら無事wineがビルドできました。



また、古くからHomebrewを使っているユーザーは、Homebrew版の`libiconv`がインストールされていることがあるので注意が必要です。サクッとアンインストールしてしまいましょう。`libiconv`はMac標準で搭載されているので、Homebrew版は廃止されたそうです。

こちらからは以上です。
