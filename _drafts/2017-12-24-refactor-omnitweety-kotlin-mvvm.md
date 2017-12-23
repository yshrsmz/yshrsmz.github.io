---
layout: page
title: 趣味アプリをMVPからMVVMに書き換えて更にKotlin化した話
tags:
  - android
  - kotlin
---

[Android Advent Calendar 2017](https://qiita.com/advent-calendar/2017/android)の24日目です。

　2年ほど前(2015年)に個人で作ったAndroidアプリを、ふと思い立って完全リファクタリングすることにした。
理由はいくつかあるけれど、主なところでは下記の三点だ。

- Kotlinの流れがきている
- Android CleanArchitectureを踏襲してみたけど…
- 最近はMVPよりMVVMが好き


### Kotlinの流れが来ている

　[去年(2016年)につくったアプリ](https://github.com/yshrsmz/monotweety)はKotlinで書いていて、Kotlinがどういったものかとかその便利さはもともと知っていた。  
 最近では業務のアプリも新規のコードはKotlinで書いていたし、なにより今年のGoogle I/OではAndroidでのKotlin公式サポートが追加された。apkのサイズが増えるとかはあるけど、今更Javaに固執する必要もないなあ、という感じ。
 
 ### Android CleanArchitectureを踏襲してみたけど…
 
 [Android CleanArchitecture](https://github.com/android10/Android-CleanArchitecture)を写経するくらいの感じで作ったけれど、今見返してみると色々と気になる点が多かった。

例えばdata層の`DataStoreFactory`。本家の実装ではこの`DataStoreFactory`でローカルデータの存在判定をして実際に使う`DataStore`を切り替えたりしてる。でも、RxJavaだったら`merge`オペレータとかでこの「キャッシュの存在判定してなかったらサーバに問い合わせ」的なコードはシュッと書けるのでファクトリクラスはなくてもいいかなー、という気持ちが強くなっていた。

あと、本家の実装では画面回転時のViewの状態保持、各画面Fragmentを`retainInstance = true`にすることで実現していた。これ実装当時も気持ち悪いなーって思いながら踏襲してたけど、ちょうどGoogle I/O 2017でArchitecture Componentsが発表されたので、これの`ViewModel`を使ってよりスマートに解決することにした。

### 最近はMVPよりMVVMが好み

　これは完全に好みの問題な気もするけど、最近はDataBindingもあるしMVVMっぽいView/Presentation層の作り方が好きだ。

　MVPのどこが肌に合わなかったかというと、「interfaceとはいえPresenterがViewのことを知っているので、Viewのライフサイクルに合わせなければならない箇所がある」という点だ。Androidは画面回転が発生するとActivityやFragmentが再生成されるし、`onStop`以降で画面をいじるとアレなことになる。なのでどうしても`Presenter#takeView(View)`とか`Presenter#dropView()`みたいなメソッドを作ることになるし、`Presenter`内では`View`がnullかどうかチェックして回る必要がある。
