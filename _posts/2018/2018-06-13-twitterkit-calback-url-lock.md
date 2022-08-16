---
layout: post
title: TwitterKit使ってるアプリでブラウザ経由のログインできなくなった件
category: programming
tags:
  - TIL
  - android
  - twitter
---

[前々から告知されていた](https://twittercommunity.com/t/action-required-sign-in-with-twitter-users-must-whitelist-callback-urls/105342)けど、2018/06/13にTwitter認証のコールバックURLをコード側で任意に変えることができなくなった。

TwitterKitはこの、コード側で任意にコールバックURLを変更できる仕様を前提として作られているので、当然のようにブラウザ経由でのログインができなくなってしまう。

[解決策書いてる人](http://rskull.hateblo.jp/entry/2018/06/12/192337)もいて、それ試してみたけど動かなかったのでコード読んでみた。

### 結論

TwitterKit for iOSとTwitterKit for AndroidではコールバックURLの仕様が異なっているので、両方を https://apps.twitter.com のコンソール上で指定する必要がある。

| | url scheme | code |
-|-|-
TwitterKit for Android | `twittersdk://` | [OAuth1aService.java#L59](https://github.com/twitter/twitter-kit-android/blob/c148862c612c66d0f2b50cac40adf4e3d287cb8b/twitter-core/src/main/java/com/twitter/sdk/android/core/internal/oauth/OAuth1aService.java#L59)
TwitterKit for iOS | `twitterkit-YOUR_CONSUMER_KEY://` | [TWTRLoginURLParser.m#L39](https://github.com/twitter/twitter-kit-ios/blob/2cd78d3d5783d998f6b5fde242d1dd69d32e385d/TwitterKit/TwitterKit/Social/Identity/TWTRLoginURLParser.m#L39)

TwitterKitも近いうちにサポートなくなってしまうのでなんとかしないとなあ…


#### 2018/06/14 追記

twitter-kit-iosのコードを眺めてたら、 コンソールから`twittersdk://`を設定しておけばそれで[動いてくれそうな記述があった](https://github.com/twitter/twitter-kit-ios/blob/b6eb49d149b056d826cbc4b53eaeb39a3ebd591e/TwitterKit/TwitterKit/Social/Identity/TWTRLoginURLParser.h#L34-L45)。  
フォールバック的な挙動にも見えるけど、結論`twittersdk://`だけ設定しておけばよさそう。

