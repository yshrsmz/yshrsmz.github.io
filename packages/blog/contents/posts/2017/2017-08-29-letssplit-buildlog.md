---
layout: post
title: Let's Splitを作った話
category: keyboard
tags:
  - keyboard
  - Let's Split
---

Kinesis -> ErgoDox -> Let's Split(NEW!)

Kinesisから数えて三台目のメカニカルキーボードで、初めての自作です。


## パーツ

大体「[格子配列で左右分離型の超コンパクトなキーボード "Let's Split" を組み立てたよ](http://riv-mk.hateblo.jp/entry/2017/03/05/164425)」と「[nicinabox/lets-split-guide](https://github.com/nicinabox/lets-split-guide)」を参考にパーツを集めました。  
ケースは参考サイトとは異なり、M2ネジ使うタイプの方を使ったのでそんな感じのリストになってます

名称 | 値段 | 調達先
---|---|---
PCB | $8.99 x 2 | [MEHKEE](https://mehkee.com/products/lets-split-pcb?variant=44914069775)
ケース | $40 | [Ponoko](https://www.ponoko.com/)
Pro Micro | \972 x 2 |  [マイクロファン](https://store.shopping.yahoo.co.jp/microfan/pro-micro-5v-16mhz.html)
タクトスイッチ | \313 | [札幌貿易](https://store.shopping.yahoo.co.jp/sapporo-boueki/1sw-081.html)
ダイオード(1N4148) | \100 x 2(100本) | [秋月電子](http://akizukidenshi.com/catalog/g/gI-00941/)
TRRS Jack | \125 x 2 | [DigiKey](http://www.digikey.jp/product-detail/ja/cui-inc/SJ-43514/CP-43514-ND/368146)
TRRS Cable | \700 | [Amazon](http://amzn.to/2wDtxrW)
USB - MicroUSBケーブル | \2463 | [Amazon](http://amzn.to/2gayNwi)
M2ネジ(6mm) | $3.49 x 2 | [Keebio](https://keeb.io/collections/frontpage/products/m2-screws-and-standoffs)
スペーサー | $3.49 | [Keebio](https://keeb.io/collections/frontpage/products/m2-screws-and-standoffs)
キースイッチ | \832 x 5(50個) |[ジェイダブルシステム](https://www.jw-shop.com/P-keyboard-mswitch10/page45/detail.htm)
キーキャップ | 1セット |
クッションゴム | \373 | [Amazon](http://amzn.to/2wDpCvh)

送料はちょっと思い出せないのだけど、だいたいこんな感じ。  
ちょっとアホやったなーって思うのは、海外の通販ショップを部品ごとに使い分けたこと。店によってはかなり送料かかるので、品揃えのいい店でまとめて購入したほうがいいです。

ケースは[nooges/lets-split-v2-case](https://github.com/nooges/lets-split-v2-case)で配布されているものを使っています。どのファイルを使ったらいいのかちょっとわかりづらいんですが、[sandwich-split.eps](https://github.com/nooges/lets-split-v2-case/blob/master/sandwich-split.eps)を使ってPonokoに依頼を出しました。

USBケーブルは、Pro Microのジャックがすぐ壊れそうで不安だったので、MacbookのMagsafe(もうないですけど…)っぽい感じで、抜き差しせずに使えるものを用意しました。



## 制作について

大体前掲のウェブサイトのとおりに作っています。  
あとはYoutubeで[ライブストリーミングしながら作ってる人を見つけた](https://www.youtube.com/watch?v=-jjj4LcliOU)ので、これも適宜確認。

特に気をつけたのは、Pro Microの裏にあるキースイッチをつけるときです。  
キースイッチのピンとPro Microがくっついてショートするよー、って記述を何箇所かで見かけたので、キースイッチのはんだ付けが終わった後、できるだけピンを切って出っ張りを低くして、Pro Microと干渉しないようにしています。

あとはTRRS Jackを裏表逆につけたりとかありましたけど、比較的スムーズに組み立てられたと思います。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr"><a href="https://twitter.com/hashtag/%E3%83%AC%E3%83%84%E3%83%97%E3%83%AA?src=hash">#レツプリ</a> Pro Micro付けてファームウェアも焼いたけどスペーサーの長さ間違えたので今日はここまでです <a href="https://t.co/maIEy5ymhS">pic.twitter.com/maIEy5ymhS</a></p>&mdash; せーい@一万二千年後のイカ (@_yshrsmz) <a href="https://twitter.com/_yshrsmz/status/899575030962569216">2017年8月21日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

PCBにもろもろはんだ付け完了したところ。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">余ってたキーキャップ使ったから高さがアレだけど、初めての <a href="https://twitter.com/hashtag/%E3%83%AC%E3%83%84%E3%83%97%E3%83%AA?src=hash">#レツプリ</a> 完成！ <a href="https://t.co/gvd3zyklXI">pic.twitter.com/gvd3zyklXI</a></p>&mdash; せーい@一万二千年後のイカ (@_yshrsmz) <a href="https://twitter.com/_yshrsmz/status/900716146629816322">2017年8月24日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

完成直後。

## キーマップ


![keymap](https://lh3.googleusercontent.com/sLb_K0gUuDBupxKVz7bwXZi4sVblU--fCRLlFR2eQIYzwAFNKdxFcUmUK7aUfzcYaO2rySZjaLU_tjBZTJRltzRo46wThMmAvM6ncH9xXObeYkA448qRzXYZhWOwl0h0vsKkg-_BmNx8ZTvuZL6MIlyuyPTbeouq7U5Z0E9pjULK747AV8CNAtDjHMqbQoFmFRvA6vy2bIdO4kQK3OBoFALBmDRfq77y2l4azjI4kt1-3ffpjw3dKKstejircWhjesMBjvO4o1X1efxbHuZy40C_j8pPQpwazyfVCrZ8RNbRIiNeNd6kD0K23qYxTLCm6ABi5qLoPz87WGgfmIMdU8qYb2Fj61NQqEUsCCoszQhtfXqEhLXBusJMX7uoqTrzVjeZBOlvnSFYyCvqP1G0Kbl47hYBqbM_tJdiju8SRKuEaVdMMjb32VAQvAMWsHcKkqp2r_2VVQXvfICKrwJfxAkSg-QgUfb8y5egTKC3G4c94XWvRtZjtDdzicTXt5WlxJUsJSkXk0C3PUA9B8jxnGIHAF3MRJQIz9FUai09jnkIWelJamB4maktWLzGg4QJzlErj4sMbCbVxLB-9fiL4zVN5-Cw92S0tBaCiQvzsYomwnaaA4SH=w792-h685-no)

現状こんな感じ。  
最初はErgodox/Kinesisぽい感じにしようかとも思ったんですが、このサムクラスターがないキーボードでエンターキーとかを真ん中に持ってくるとスペースキーとの誤爆が激しくて諦めました。  
慣れの問題な気もするのでそのうちまた試すかもしれない。

## 所感

最初は[Dactyl Keyboard](https://github.com/adereth/dactyl-keyboard)を作る前の予行練習的なノリで作り始めましたが、出来上がってみると結構愛着わきます。なにより小さくてかわいい。

とはいえ、キー配置は二、三日ではまったくなれない(笑)

気がつくとエンターキーのつもりでスペース押すし、左右矢印キーのつもりでCtrl/Altキー押すし、かと言ってErgoDox風にすると今度は左右矢印をCtrl/Altと間違えるし…  
普通のキーボードからの移行ならもっとスムーズだったと思います。

まあこれは慣れが必要な部分もあると思うので時間が経つにつれちゃんと入力できるようになるでしょう。


### 参考
- [格子配列で左右分離型の超コンパクトなキーボード "Let's Split" を組み立てたよ](http://riv-mk.hateblo.jp/entry/2017/03/05/164425)
- [nicinabox/lets-split-guide](https://github.com/nicinabox/lets-split-guide)
- [Livestream - The Board Podcast LIVE! - Building a Lets Split v2 Ortho Keyboard](https://www.youtube.com/watch?v=-jjj4LcliOU)
