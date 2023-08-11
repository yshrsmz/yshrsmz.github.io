---
layout: post
title: (TBD) Jetpack Compose ではなく Android View で書いた方が実装早くすみませんか？　と言われたときに考えること
category: programming
tags:
  - Android
  - Jetpack Compose
---

「一旦 Android View で組んであとから Jetpack Compose 化したらどうですか？　最初から Jetpack Compose でやる必要なくないですか？」

と言われたときどうしよう案件

オチはない

基本的に説得材料集めるために書いてるので視点は偏っているし、裏付けがあるわけでない内容もあるので話半分で眺めてね

---

- これ読んで
  - [Why Compose - Jetpack Compose - Android Developers](https://developer.android.com/jetpack/compose/why-adopt)
- Google が時期主力 UI 開発ツールキットとして移行を推奨している
  - 開発リソースは Jetpack Compose へ寄っていくことが予想できる
- 故に Android View はそのうちメンテナンスモードになる
  - https://twitter.com/JimSproch/status/1394978976700018690?s=20
    - もうメンテナンスモード入ってるぽい？
      <blockquote class="twitter-tweet"><p lang="ja" dir="ltr">Androidビューはメンテナンスモードです。 相互運用性レイヤーとして引き続きサポートしますが、すべての新しい開発とバグ修正はJetpackComposeに組み込まれます。 Composeは、Androidの未来の最新UIツールキットです。</p>&mdash; Jim Sproch (@JimSproch) <a href="https://twitter.com/JimSproch/status/1394978976700018690?ref_src=twsrc%5Etfw">May 19, 2021</a></blockquote>
    - Jim Sproch 氏は Jetpack Compose 生みの親
  - 新機能の追加は限定的になっていく
  - 直接 Android View の話ではないが、 DataBinding(と ViewBinding) はメンテナンスモードへの移行がアナウンスされている
    - https://issuetracker.google.com/issues/173030256
    - これは DataBinding の依存する kapt がメンテナンスモードに入っているから
    - kapt 後継の ksp に対応する予定はない
    - kapt は Kotlin 2.0 で正式導入される K2 Compiler では現状サポートされていない
      - kapt サポートの予定自体はありそう
        - https://slack-chats.kotlinlang.org/t/9019545/new-kotlin-intensifies-purple-party-parrot-mega-kotlin-1-8-2
    - Jetpack Compose への移行が推奨されている
    - 実際に使えなくなることはそうないと思うが、これがなくなると Android View での開発は片腕をもがれたような状態になる
      - なにかのタイミングで deprecated されるかもしれないものに依存して開発を続けるのか？
- Jetpack Compose は OS に組み込まれておらず、独立したライブラリ(群)として提供されている
  - Android View と異なり、クライアント OS のバージョンに関わらず最新の機能が使える
    - 不具合修正も同様に、アプリ側でライブラリの更新をすれば取り込める
- 最近(といってもだいぶ昔からだけど)のトレンドである宣言的プログラミングを採用している
  - UI 定義とふるまいの定義が同じ場所にあるから、ファイルを行ったり来たりする無駄がない
- Android View よりもテストが書きやすい
  - 要出典
  - Android View と異なりすべてが関数なので、input/output が明確でセットアップし易いのは確実
  - VRT(画像回帰テスト) もやりやすい
  - [良いコードとは何か - エンジニア新卒研修 スライド公開｜CyberZ Developer](https://note.com/cyberz_cto/n/n26f535d6c575)
  - テストが書きやすいということは自動テストで担保できる範囲が広がるので、品質を担保しつつ flaky で時間のかかる手動テストを減らせる、ということ
- コードが少なくてすむ
  - 顕著なのは RecyclerView
- Android View の方が実装速度はやい？
  - そんなことはない
  - しかし習熟度の関係で一時的に Android View で作ったほうが早い、と思われる場面はありそう
    - 書き直す時間まで考えると倍になる
    - 正直「書き直す時間がもらえるだろう」と確信できる信頼関係があるなら(あるいはいスケジュールに組み込んでもらえてるなら)、 Android View で書いちゃってもいいんでないの、とは思う
  - Jetpack Compose は拡張性を念頭に作られているので、カスタムコンポーネントは作成しやすい
  - Android View ではめんどくさくて諦めていたテストも書いているから、ちょっと時間はかかってるかもしれないがトータルで品質は上がっている説
    - テスト書いてる場合に限る
      - -> **というかテスト書きましょう**
- ビルドがはやい
- アプリサイズが小さくなる
- 新技術へのモチベーションで効率アップ
- そもそも「あとから Jetpack Compose 化」する機会は訪れるのか

---

基本的に

- 今コストかかってるかもしれないが、長いスパンで見ると品質や開発速度は上がってますよ
- そもそも「(習熟度の問題があるから) Android View のほうが早く実装できますよ、は幻想」
- Jetpack Compose で書くと技術広報や採用でもアピールできますよ
- 価値観が合わないので転職しますね
  - 実際タイトルのようなことを言われてモヤッと/イラッとした、ということは良好な信頼関係気づけてない説ありません？


みたいな選択肢になるんじゃない(暴言がすぎる)
