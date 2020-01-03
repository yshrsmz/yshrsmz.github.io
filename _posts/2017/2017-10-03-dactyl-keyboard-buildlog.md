---
layout: post
title: Kinesis Advantageの左右分離版みたいなキーボード、Dactylを作った話
category: keyboard
tags:
  - keyboard
  - Dactyl
---

Kinesis -> ErgoDox -> Let's Split -> Nyquist -> Dactyl(New!)


[前回Let's Splitを作って](http://yslibrary.net/2017/08/29/letssplit-buildlog/)から一ヶ月も経ってないですが、Dactylキーボードを作りました(実はその間にNyquistってキーボードも作ってたりします)。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">というわけでNyquist組み上がりました <a href="https://t.co/l3dPOQbHz0">pic.twitter.com/l3dPOQbHz0</a></p>&mdash; せーい@一万二千年後のイカ (@_yshrsmz) <a href="https://twitter.com/_yshrsmz/status/904352414911696897?ref_src=twsrc%5Etfw">2017年9月3日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Nyquist。Let's Splitにもう一行足したようなキーボード。これもビルドログ書こうかと思ったけどすっかり忘れてた。

Dactylはこっち。

![dactyl](https://lh3.googleusercontent.com/JP0AGwqay2hdO69ZZ8NKW3bdcHjMhPYkIAqkXkamzolM56ZcTqGmJGaQ3qLkr9mA2zCcI4Jxl4kAQuMCc0Y1qtx3lji2iW7lhkSizTM-tswj25AbLf5wbi3F3deHInzATiOumS0m3A=w900)


## パーツ

名称 | 値段 | 調達先
---|---|---
ケース | $240 | [Shapeways](https://www.shapeways.com/shops/bespokeys)
キースイッチ | \832 x 7(70個) |[ジェイダブルシステム](https://www.jw-shop.com/P-keyboard-mswitch10/page45/detail.htm)
Teensy 2.0 | $16 | [PJRC](https://www.pjrc.com/store/teensy.html)
I/O Expander | $1.6 | [Digi-Key](https://www.digikey.com/short/q74r2r)
ダイオード(1N4148) | \100 x 2(100本) | [秋月電子](http://akizukidenshi.com/catalog/g/gI-00941/)
LED | \100(10個) | 秋月電子
LED用抵抗 | \100(100本) | 秋月電子
1/4W 2.2kΩ 抵抗 | \100(100本) | [秋月電子](http://akizukidenshi.com/catalog/g/gR-25222/)
TRRS Jack | \125 x 2 | [DigiKey](http://www.digikey.jp/product-detail/ja/cui-inc/SJ-43514/CP-43514-ND/368146)
TRRS Cable | \700 | [Amazon](http://amzn.to/2wDtxrW)
キーキャップ | 1セット |
クッションゴム | \373 | [Amazon](http://amzn.to/2wDpCvh)

だいたいこんな感じ。  
LEDとその抵抗は、お好みに合わせて調達してください。今回のビルドではレイヤ切り替えのインジケータとして３つだけ使ってます。  
キーキャップも値段様々なのでお好みで。
ちなみにワイヤは30AWGのものを使っています。

### 制作について

ErgoDox EZで使ってるキーマップを流用したかったので、本家レポジトリにある[QMK用のガイド](https://github.com/adereth/dactyl-keyboard/blob/master/qmk-guide/README.md)と、その [ガイドの作者が書いたビルドログ](http://joedevivo.com/2017/05/20/building-a-qmk-dactyl.html)、あとはこの記事を書いてる時点ではマージされてないこの[PR](https://github.com/adereth/dactyl-keyboard/pull/50) を参考にしました。

これらのガイドではErgoDoxにあってDactylにない内側のキー３つを追加しているけど、この計６つのキーを無視してもErgoDox EZのファームウェアがそのまま動いた。

![はんだ付け](https://lh3.googleusercontent.com/d89UAfrHcinVlnT2FY2mSe3JWAXXY_1Pg2gSST6dvnib2tBiBnoYXfZG7A0BbBHta3g36vTA2yPExdcaLZ7YoxqrvvYH3mYNK5iSvd_eIJSwB-HAjGRcD2OOPgqGfDObx9nmpJVUDA=w900)

左右のキースイッチはんだ付けが終わったところ。  
ガイドには「特に接着剤使わなくてもキースイッチ固定される」って書いてあるけど、作ってみた感じホットグルーとかで軽く接着したほうが良さそうだった。  
確かに固定はされるんだけど、キーキャップを外すときにスイッチも一緒に外れちゃうので配線が痛みそうな感じだった。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">Dactyl左側もつなぎこんで動くことを確認！　あと一息だ～ <a href="https://t.co/NZ9VeKoX0e">pic.twitter.com/NZ9VeKoX0e</a></p>&mdash; せーい@一万二千年後のイカ (@_yshrsmz) <a href="https://twitter.com/_yshrsmz/status/909981359157927936?ref_src=twsrc%5Etfw">2017年9月19日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Teensy2.0とかを実際にはんだ付けする前にブレッドボードで確認。  
I/O Expander側のcolumnの配線、ガイド通りにやったらうまくいかなくて逆にしたような気がするけどもはやよく覚えてない。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">Dactylの左側できたぽい <a href="https://t.co/DmDECq2h48">pic.twitter.com/DmDECq2h48</a></p>&mdash; せーい@一万二千年後のイカ (@_yshrsmz) <a href="https://twitter.com/_yshrsmz/status/911474826509828096?ref_src=twsrc%5Etfw">2017年9月23日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

左側のつなぎ込み。  
Teensy 2.0とI/O Expanderはそれぞれ２つずつ用意していたので、この辺はブレッドボードを横に置きながら一つずつワイヤを本番のパーツに移していった。


<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">Dactyl右側進捗 <a href="https://t.co/0RQWJhlV7a">pic.twitter.com/0RQWJhlV7a</a></p>&mdash; せーい@一万二千年後のイカ (@_yshrsmz) <a href="https://twitter.com/_yshrsmz/status/911543909490110464?ref_src=twsrc%5Etfw">2017年9月23日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

右側のつなぎ込み。  
実は繋ぎこんでる途中で、本番用のTeensy 2.0が偽物だったことが判明。  
公式サイトから急遽正規品を注文したので、ここで一週間くらいパーツ待ちが発生した。  
amazon.jpでもふつーに偽物おいてるので注意してほしい。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">公式から買ったTeensy2.0が来たので偽物と比較。それぞれ右側が偽物。偽物の方にはTeensy2.0って書いてあるしややこしい。 <a href="https://t.co/uXGQNWJ2WX">pic.twitter.com/uXGQNWJ2WX</a></p>&mdash; せーい@一万二千年後のイカ (@_yshrsmz) <a href="https://twitter.com/_yshrsmz/status/911493660847497216?ref_src=twsrc%5Etfw">2017年9月23日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

というわけで偽物との比較。[公式にも偽物への注意を喚起するページ](https://www.pjrc.com/teensy/counterfeit.html)があって、まんまそこに書いてあるとおりだった。


<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">Dactylにキーキャップもつけた。右裏側にはTeensyのリセットボタン用に雑に穴開けてみたり。いやー楽しかった <a href="https://t.co/75vGhnFkTr">pic.twitter.com/75vGhnFkTr</a></p>&mdash; せーい@一万二千年後のイカ (@_yshrsmz) <a href="https://twitter.com/_yshrsmz/status/911836736715505664?ref_src=twsrc%5Etfw">2017年9月24日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

で、いろいろあったけど組み上がり。
実はケースを注文したのが今年の4月くらいだったので、実に5ヶ月越しの完成。


### 所感

ずっとKinesisのような形の左右分離型キーボードが欲しくて、でも見つからなくてErgoDox EZを使っていたので、ようやく作ることできて大変満足している。  
使い勝手もKinesisと変わらず、不満だったあの大きさが解消されてもはやこれが"Endgame"でいいんじゃないか？　ってくらい。
[reddit](https://www.reddit.com/r/MechanicalKeyboards/comments/724bvt/finished_my_first_dactyl/)と[imgur](https://imgur.com/gallery/v8HwF)にも投稿ずみ。

とりあえず自宅用と職場用で二台は必要なので、もう一つ作るときにできれば改善したい点は下記の通り

- お椀型だから仕方ない部分はあるけど若干背が高い(今はパームレスト二枚重ねてる)ので、どうにかして低くできないか
- 改善したいというかどうにかしてトラックボールとか追加できないか
- キースイッチはちゃんと接着する
- スイッチ間のはんだ付けがめちゃくちゃめんどくさかったので、ポリウレタン線とか検討
- TeensyやIO Expanderとの接続用ワイヤは全部端っこに付けちゃうと遊びがなくなって結構めんどいので、適度に分散させる

ってまあこれ全部やろうとするともはやそれはDactyl keyboardなのか？　って気もしますね  
こうやって沼にハマっていくのか…




