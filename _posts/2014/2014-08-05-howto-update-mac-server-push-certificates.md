---
layout: post
title: Mac OSX 10.9(Mavericks) Server でプッシュ通知サービスの証明書を更新する
category:
  - programming
tags:
  - mac
---

2015/7/7追記: OSX 10.10 Yosemiteでも同様の手順で証明書を更新できます。

Serverのどこをいじれば証明書を更新できるかようやくわかったのでまとめておく。

こんなメールが来るようになったら証明書を更新しましょう。

## 手順

1. Serverアプリを開いて証明書を更新したいサーバを選択

2. サイドバーからサーバ名を選択

3. 設定タブを選択

4. 「アップルプッシュ通知を入にする」というチェックボックスの右にある編集ボタンをクリック

5. 出てきたモーダル内の更新ボタンをクリック

6. OKボタンを押して完了！

メールを見てもイマイチ何をしたらいいかわかりづらいので、メール内にヘルプページへのリンクとか入れてくれたらいいのに…


参考: [NowBrowsing: OS X Server: Advanced Administration: Renew a push notification certificate - ](http://help.apple.com/advancedserveradmin/mac/10.8/#apd2A6A09A7-D949-47EB-B3EA-F8B5BA419962)
