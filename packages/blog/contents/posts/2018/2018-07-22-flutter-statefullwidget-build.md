---
layout: post
title: (Flutter) なぜStatefullWidgetではなくStateがbuildメソッドを持っているのか
category: programming
tags:
  - TIL
  - flutter
---


最近趣味と実益を兼ねてFlutterを触っている。

だいたいReactっぽくて良さそうな感じ。React Nativeと違って、UIレイヤについては基本的にFlutterの中で完結するのが好み。

ただ`StatefulWidget`を作るときにちょっと気になることがあった。`StatefulWidget`はそれ以外にWidgetの状態を管理する`State`クラスが必要なんだけど、`StatefulWidget`ではなく`State`の方にUIを描画する`build`メソッドがあるのだ。

ReactでもそうだしMVPやらMVVMでもそうだけど、だいたい状態を管理するクラスとUIを描画するクラスを分離することで責任を分離している。それをなぜわざわざ`State`クラスに`build`メソッドが生えているんだろう？　と違和感しかなかった。

そんなわけでちょっと調べてみたら、やっぱり同じように思う人はいたらしくissueがたっていた。

[FAQ request: why is the build() method on State, and not StatefulWidget ?](https://github.com/flutter/flutter/issues/8794)

要約すると下記のような理由らしい。

`StatefulWidget`に`build`メソッドを生やすことにすると、メソッドシグネチャが`StatefulWidget#build(BuildContext, State)`になる。  
このメソッドの中でクロージャを定義すると暗黙的に`this(この場合はStatefulWidget)`がキャプチャされる。で、`build`メソッドが呼ばれたときに、`StatefulWidget`は作り直されたにも関わらずクロージャの`this`は古い`StatefulWidget`を参照したままで古い状態を参照してしまう。  
一方`State#build(BuildContext)`であれば、`State`は`StatefulWidget`が再生成されたときでもそのまま保持されるので、`this`の対象が変わることはない、ということだ。

あとは、`StatefulWidget#build(BuildContext, State)`だと、これ継承した新しい`StatefulWidget`を作ったときに実装の詳細である`State`を子クラスに公開しなければならなくなる、とか。

仕様的にこうせざるを得なかった、というのはわかったけどやっぱり釈然としない感じはある。

こういった点を何とかするためにBLoCパターンとかMVW系のデザインパターンを実装するんだろうけど、そのへんはまだ分かりきっていないので引き続き調べる。

ちなみに上述のissueの中身は現在[APIドキュメントの方](https://docs.flutter.io/flutter/widgets/State/build.html)にも記載されている。
