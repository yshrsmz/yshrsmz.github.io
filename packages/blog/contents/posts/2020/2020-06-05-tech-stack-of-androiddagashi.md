---
layout: post
title: AndroidDagashiを支える技術
category: programming
tags:
  - GitHub
  - Vue.js
  - nuxt.js
  - AndroidDagashi
---


[AndroidDagashi](https://androiddagashi.github.io)、ご存知ですか。

英語圏のものを中心に、Android関連のニュース/記事を日本人向けにまとめている週一更新のまとめサイトです。  
2018年の2月に開設して、おかげさまで2年が経ちました。

さて今日はAndroidDagashiをどうやって運用しているかざっくりまとめてみます。

---

全体像を図示するとだいたいこんな感じです

![diagram](https://lh3.googleusercontent.com/pw/ACtC-3chGy286Ew_WJHL9FaWtes7VdRfEha6YAOBTs59Ih3Rd7arkWflEOua7Gr2oXdzrnuo504U_r2yslHD1mxFkxQi6LxpOOPCs5A24Pacd6ZVlqvdZQvjpHQbm60R3R-VrCx6ZgqI9vFLub0o-BmsojnpHA=w1500-h843-no)


AndroidDagashiはドメインからわかる通り、GitHub Pagesでホストされた静的サイトです。  
[Vue.js](https://jp.vuejs.org/)を利用したWebアプリケーションフレームワークである[Nuxt.js](https://ja.nuxtjs.org/)の、静的サイト生成機能を使っています。

このサイトは、2つのGitHubレポジトリで構成されています。  
一つはサイト本体のコードが置いてある[AndroidDagashi/androiddagashi.github.io](https://github.com/AndroidDagashi/androiddagashi.github.io)。  
そして、記事データを管理する[AndroidDagashi/AndroidDagashi](https://github.com/AndroidDagashi/AndroidDagashi) です。

`AndroidDagashi/AndroidDagashi` では、1マイルストーンを各週のページ、1 issueを1リンクとして管理しています。シェアしたいリンクをissueとして投稿して、そのissueを対応する週のマイルストーンに紐づける感じです。

デプロイには`AndroidDagashi/androiddagashi.github.io`のGitHub Actionsを利用しています。


デプロイ関係のワークフローは下記の3つです。

- 1時間に一度、`AndroidDagashi/AndroidDagashi`から記事データを取得してサイト用のJSONファイルに加工し、pushする
- `AndroidDagashi/androiddagashi.github.io`へのpushをトリガーに起動し、サイトをビルドしGitHub Pagesにデプロイする
- GitHub Pagesへのデプロイ完了をトリガーに起動し、新着記事があったらTwitterへ投稿する


サイト用JSONファイルの作成ワークフローはclose済みのマイルストーンを取得するようになっています。  
1時間毎に動かしているのは、コメントとかあった時に反映するためにですね(現状あまり活用できていませんが…)。

JSONの生成ジョブは、特定のissueへのコメントで実行できるようにもしています。  
だいぶ泥臭い設定になっていますが、2020年5月末現在GitHub Actionは手動実行をサポートしていないのでその代替手段です。

---

そんな感じで、日々の運用作業は

- リンク(issue)を投稿する

だけです。

ただそれ以外に毎週のリリース作業として、

- その週に投稿されたリンクからめぼしいものをピックアップしてマイルストーンのサマリを作成
- リリース直前(だいたい日曜の20時リリースなので19時-20時の間)にマイルストーンをclose

があります。

半年前くらいまでは新着通知のツイートも手動だったんですが、一念発起して自動化しました(だいぶ楽になった)。  
やろうと思えばサマリの作成とマイルストーンのcloseも自動化できそうな気はするので、今後の課題です。

---

## おわりに

以上、ざっくりとしたAndroidDagashiのサイトについての説明でした。

この仕組み自体はGitHubとFirebase(無料枠で済むしTwitterに投稿とかしなければいらない)だけで成り立っているので、結構いろんな分野で汎用的に使えるのではないかなー、と思っています。AndroidDagashiでは記事データのレポジトリもサイトのレポジトリもpublicで運用していますが、privateにしても特に問題はないはずです。

`androiddagashi.github.io` はMITライセンスで公開しているので、気になった方はご自由にフォークして遊んでみてください。  
コントリビュートもお待ちしております！
