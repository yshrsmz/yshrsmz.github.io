import{_ as e,c as a,L as r,o}from"./chunks/framework.B28L1Bbi.js";const b=JSON.parse('{"title":"2020年を振り返って","description":"","frontmatter":{"layout":"post","title":"2020年を振り返って","category":"diary","tags":["diary"],"head":[["link",{"rel":"canonical","href":"https://www.codingfeline.com/2020/12/31/lookingback-2020/"}],["meta",{"property":"og:url","content":"https://www.codingfeline.com/2020/12/31/lookingback-2020/"}],["meta",{"property":"og:title","content":"2020年を振り返って"}],["meta",{"property":"twitter:card","content":"summary_large_image"}],["meta",{"property":"twitter:site","content":"@_yshrsmz"}],["meta",{"property":"twitter:creator","content":"@_yshrsmz"}],["meta",{"property":"og:image","content":"https://www.codingfeline.com/2020/12/31/lookingback-2020/ogp.png"}]]},"headers":[],"relativePath":"2020/12/31/lookingback-2020/index.md","filePath":"posts/2020/2020-12-31-lookingback-2020.md","date":{"time":"2020-12-31","string":"December 31, 2020","year":"2020","month":"12","day":"31"}}'),i={name:"2020/12/31/lookingback-2020/index.md"};function p(l,t,n,s,h,c){return o(),a("div",null,t[0]||(t[0]=[r('<p>2020年を振り返るよ。<br> 買ってよかったもののまとめは<a href="/2020/12/28/bestbuy2020/">こちら</a></p><p><strong>目次</strong></p><nav class="table-of-contents"><ul><li><a href="#仕事">仕事</a><ul><li><a href="#_2018年の後半から作っていたアプリがようやくリリースされた">2018年の後半から作っていたアプリがようやくリリースされた</a></li><li><a href="#nuxt-jsで記事メディアの立ち上げ">Nuxt.jsで記事メディアの立ち上げ</a></li><li><a href="#nuxt-jsで既存サービスのリニューアル-進行中">Nuxt.jsで既存サービスのリニューアル(進行中)</a></li></ul></li><li><a href="#個人-プロジェクト">個人(プロジェクト)</a><ul><li><a href="#monotweetyがtwitter-apiのアクセス制限された">MonotweetyがTwitter APIのアクセス制限された</a></li><li><a href="#twitter4kt">Twitter4kt</a></li></ul></li><li><a href="#個人-生活">個人(生活)</a><ul><li><a href="#新型コロナウィルス">新型コロナウィルス</a></li><li><a href="#フェレットが死んだ">フェレットが死んだ</a></li><li><a href="#猫が増えた">猫が増えた</a></li><li><a href="#アボカド育て始めた">アボカド育て始めた</a></li></ul></li></ul></nav><h2 id="仕事" tabindex="-1">仕事 <a class="header-anchor" href="#仕事" aria-label="Permalink to &quot;仕事&quot;">​</a></h2><p>今年はAndroidアプリエンジニアというよりはWebフロントエンドエンジニアとしての仕事が多かった。<br> AndroidとWebフロントと掛け持ちしてるとタスク溢れが深刻なのでどうにかしたい。</p><h3 id="_2018年の後半から作っていたアプリがようやくリリースされた" tabindex="-1">2018年の後半から作っていたアプリがようやくリリースされた <a class="header-anchor" href="#_2018年の後半から作っていたアプリがようやくリリースされた" aria-label="Permalink to &quot;2018年の後半から作っていたアプリがようやくリリースされた&quot;">​</a></h3><p>長かった。実装に時間がかかったというよりはビジネス的なアレコレでのびのびになっていた感じ。<br> Kotlin Multiplatform Projectで、Android/iOS向けに作ってます。 プレゼンテーション層(ViewModel)より下はすべて共通コード。</p><p>内訳はおおよそこんな感じで、まあまあ頑張ったんではなかろうか</p><blockquote class="twitter-tweet"><p lang="ja" dir="ltr">弊Kotlin Multiplatform Project(Android/iOS)のコード内訳です。Obj-CとJavaの部分は直接取り込む必要のあった外部ライブラリなのでそれは差っ引いてほしい。 <a href="https://t.co/PX8nevjR4y">pic.twitter.com/PX8nevjR4y</a></p>— せーい (@_yshrsmz) <a href="https://twitter.com/_yshrsmz/status/1309068540180336640?ref_src=twsrc%5Etfw">September 24, 2020</a></blockquote><p>ちょっと詳しい解説は<a href="/2020/12/26/review-kmp-in-production/">こちら</a>にまとめている。<br> どうでもいいけど、↑この記事は勉強会で話した内容をベースに書いた。発表するにあたって構成はちゃんとまとめてあるので、記事自体は結構な速度で書くことができ、よい感じだった。<br> 来年はもうちょっと発表の機会を増やして、発表ベースでブログ書いていってもいいかもしれない。</p><h3 id="nuxt-jsで記事メディアの立ち上げ" tabindex="-1">Nuxt.jsで記事メディアの立ち上げ <a class="header-anchor" href="#nuxt-jsで記事メディアの立ち上げ" aria-label="Permalink to &quot;Nuxt.jsで記事メディアの立ち上げ&quot;">​</a></h3><p>4-5月にかけてシュッと作った。<br> Nuxt.jsの静的サイト生成モードで出力して、S3にデプロイする感じ。</p><p>AndroidDagashiとほぼ同じ実装でやってるのでそこまで悩むことはなかったけど、仕事としてWebフロントエンドやるのは6年ぶりなのでまあ緊張した。</p><p>デプロイの最適化とかまだまだできることはあるので引き続きやっていく。</p><h3 id="nuxt-jsで既存サービスのリニューアル-進行中" tabindex="-1">Nuxt.jsで既存サービスのリニューアル(進行中) <a class="header-anchor" href="#nuxt-jsで既存サービスのリニューアル-進行中" aria-label="Permalink to &quot;Nuxt.jsで既存サービスのリニューアル(進行中)&quot;">​</a></h3><p>古いSpring Bootで書かれた8年もののサービスを今風な技術スタックで書き直そうぜ！ というプロジェクト。<br> ざっくり言うと既存のサーバサイドはGraphQL APIに書き直して、フロントエンドはNuxt.jsでSSRしよう、という感じ。</p><p>昨今のWebフロントエンドは本当に求められるものが多いなあ、AWS完全に理解した、とか言いながらいろいろやっている。</p><p>趣味で始めたことを仕事に転用して、更にそこからステップアップして、といい感じで趣味と実益を兼ねられていて大変良い流れになっている気がしている。</p><h2 id="個人-プロジェクト" tabindex="-1">個人(プロジェクト) <a class="header-anchor" href="#個人-プロジェクト" aria-label="Permalink to &quot;個人(プロジェクト)&quot;">​</a></h2><p>やっぱ本業のほうがある程度忙しいと個人開発まで頭がまわらないなー、と改めて感じた一年だった。<br> コロナ禍で外に出る機会が減って体力が落ちてるのもあるとは思うけど。</p><h3 id="monotweetyがtwitter-apiのアクセス制限された" tabindex="-1">MonotweetyがTwitter APIのアクセス制限された <a class="header-anchor" href="#monotweetyがtwitter-apiのアクセス制限された" aria-label="Permalink to &quot;MonotweetyがTwitter APIのアクセス制限された&quot;">​</a></h3><p>お前のクライアントからスパムっぽいツイート多いんだが、と神は仰せです。</p><p>Twitterの対応には若干うんざりしつつもいい機会なので、１から書き直してみた。 RxJavaからKotlin Coroutinesにしてみたり、プレゼンテーション層をMVIにしてみたり。<br> 開発開始が2016年だから、今となっては古い思想で作っているコードも多くて自分のコードながらなかなか新鮮だった。</p><p>TwitterKit for Androidからも移行しなきゃだと思ってたので、この機会に依存を削除。<br> Twitter4Jを使うのもアレなので後述するTwitter APIクライアントライブラリを自作してみた。</p><p>スパム的なメンションを行えないようにフッターに<code>@</code>を入れられないようにしてみたけど、API開放したよって返信メールで「ツイートに含むメンションは一つまでにしろ」とか「自発メンションをするな」とか言われたのでbot運用で使ってるAPIキーと思われている可能性が微レ存。<br> たしかにツイート作成以外のエンドポイントはほとんど使ってないから、スパムbotと思われても仕方ない見え方をしているかも。</p><p>そもそも<code>@</code>マークをツイートできないようにするか、あるいは定期的にタイムライン取得して普通のクライアントアプリに見えるようにしてみるとか、再公開にはもうちょい作業が必要そう。</p><p>Monotweetyは自分が使いたくて作っているものなので、公開した結果スパム認定されて自分も使えなくなってしまっては意味がない。そもそも公開停止して完全個人利用にしてしまうのもありかもしれない。</p><h3 id="twitter4kt" tabindex="-1">Twitter4kt <a class="header-anchor" href="#twitter4kt" aria-label="Permalink to &quot;Twitter4kt&quot;">​</a></h3><p><a href="https://github.com/yshrsmz/twitter4kt" target="_blank" rel="noreferrer">https://github.com/yshrsmz/twitter4kt</a></p><p>Monotweetyの件と関連して作り始めた自家製のTwitter APIクライアントライブラリ。<br> OAuth周りとかリクエストの署名周りとか、仕様を調べながら実装してなかなかおもしろかった。</p><p>現状JVMしかないけど一応Kotlin Multiplatform Projectな構成で作っている。</p><p>とりあえず自分のニーズが満たせればいいのでサポートしてるエンドポイントは限られているけど、継続的にメンテして育てていけたらいいなあ、とは思っている。</p><h2 id="個人-生活" tabindex="-1">個人(生活) <a class="header-anchor" href="#個人-生活" aria-label="Permalink to &quot;個人(生活)&quot;">​</a></h2><h3 id="新型コロナウィルス" tabindex="-1">新型コロナウィルス <a class="header-anchor" href="#新型コロナウィルス" aria-label="Permalink to &quot;新型コロナウィルス&quot;">​</a></h3><p>幸い身近なところで感染している人は今のところいなそう。</p><p>勤務先的には今のところ週二回リモートワークが全体の方針だけど、相談して週一回くらいの出社にしている。</p><p>一番の懸念は運動量なのでなんとかしたいところ。</p><p>リングフィットアドベンチャーは続かないし、夜散歩は運動負荷的に足りるのか足りないのか…</p><p>妻も同じような働き方してるので四六時中一緒だけど、今のところ仲良くやっている。<br> 同じAndroidアプリエンジニアだったりするので、お互いの仕事が何となくわかってかつ共通の話題が多いのもプラスに働いてるのかも。</p><h3 id="フェレットが死んだ" tabindex="-1">フェレットが死んだ <a class="header-anchor" href="#フェレットが死んだ" aria-label="Permalink to &quot;フェレットが死んだ&quot;">​</a></h3><p>ちょうど(と言っていいのかはアレだけど)コロナ禍でほぼリモートワークだったのが幸いして看病できたし、看取ることもできた。<br> 例年通りに通勤していたら彼はもっと早くに死んでいただろうし、死の過程を見届けることもできなかっただろう。</p><p>8月9日(日)、およそ7年半。インスリノーマだった。<br> 8月8日の朝から意識はあるけどご飯は全然食べない、という状態だった。夜妻が様子を見に行ったらベッドの外でまばたきもせずぐったりしていた。口元にウェットフードを持っていっても、いつもなら目の色を変えてがっついていたペーストを持っていっても反応しない。</p><p>ああ、その時が来たんだな、と思った。</p><p>それからは妻と交代で見守って、8月9日の17時くらいに亡くなった。<br> 言い方は悪いけど面白いもので、私がちょっとポテチ食べたいなーと思ってリビングに行って15〜30分くらい目を離している隙に逝ってしまった。ポテチ食べながら妻と「結構体力あったんだねー」なんて話していたというのに。</p><p>ケージの前に戻ったら明らかにお腹が動いてなくて、触っても鼓動もなくて息もしてなくて。<br> 抱き上げて妻を呼んで、「がんばったねえ」とか言いながらちょっと泣いてしまった。</p><p>すぐにからだを拭いて、発泡スチロールの箱に保冷剤と一緒に入れた。本当に偶然なんだけど、ちょうどその日にまとめ買いしていた冷凍ラムチョップが届いていたので程よい大きさの発泡スチロールの箱が手元にあったのだ。 そしてその日のうちに火葬の予約を入れて、次の日に火葬。翌週の動物病院の予約をキャンセルしたりもした。</p><p>火葬は専用のトラックに来てもらって、近所の道路上でやってもらう感じだった。一時間もかからないで真っ白い骨になって、小さな骨壷に収まってしまった。</p><p>ちょうど三連休の中日に逝き、翌日葬儀の都合もついて、しかも都合のいいことに保冷用の発泡スチロール箱まであって、と本当に最後の段取りがうまいフェレットだった。こんな偶然、なかなかない。</p><p>いろいろ不出来な飼い主だったけど、彼と過ごした七年半はとてもよいものだった。ありがとう。</p><h4 id="後日談" tabindex="-1">後日談 <a class="header-anchor" href="#後日談" aria-label="Permalink to &quot;後日談&quot;">​</a></h4><p>フェレットの死後一瞬間くらいの間に、夜の散歩中にハクビシンとアライグマを、日中にたぬきを見かけた。<br> コロナ禍に入ってから夜散歩をするのが趣味で、ハクビシンは今年に入って一度見かけたことがあるけど、アライグマとたぬきは初めてだった。<br> 特に信仰のない私でも霊的なものの存在を信じてしまいそうになるようなタイミングだった。<br> 「寂しくないように送ってくれたのかねえ」、なんて妻と言い合ったりした。</p><h3 id="猫が増えた" tabindex="-1">猫が増えた <a class="header-anchor" href="#猫が増えた" aria-label="Permalink to &quot;猫が増えた&quot;">​</a></h3><blockquote class="twitter-tweet"><p lang="und" dir="ltr"><a href="https://twitter.com/hashtag/%E3%81%BE%E3%81%9F%E8%88%8C%E3%81%97%E3%81%BE%E3%81%84%E5%BF%98%E3%82%8C%E3%81%A6%E3%82%8B?src=hash&amp;ref_src=twsrc%5Etfw">#また舌しまい忘れてる</a> <a href="https://t.co/0CfsBTpmey">pic.twitter.com/0CfsBTpmey</a></p>— せーい (@_yshrsmz) <a href="https://twitter.com/_yshrsmz/status/1343545702702411784?ref_src=twsrc%5Etfw">December 28, 2020</a></blockquote><p>増えたと言うか増やした。 フェレット死んだあとシャム猫？をひろう夢を見たのがきっかけ(今思うと&quot;シャム猫&quot;というよりはシルバーミットだったんだと思う)。</p><p>しばらく散歩がてら探してたけどその子とは巡り会えず(かわりにハクビシンやらアライグマやらたぬきには遭遇したけど)、そうこうしているうちにあれやこれやで保護猫カフェから引き取ることになった。</p><p>キジトラ中毛ボブテイルな女の子で、うちにはいなかったタイプで大変かわいい。</p><p>子猫はマジでエンタメだしいろんなことやらかす天然のデバッガーだしで日々楽しいと同時に忙しい。</p><p>先住には色々な面でストレスになってそうなのでうまいことフォローしていってあげたい。</p><h3 id="アボカド育て始めた" tabindex="-1">アボカド育て始めた <a class="header-anchor" href="#アボカド育て始めた" aria-label="Permalink to &quot;アボカド育て始めた&quot;">​</a></h3><p>初夏くらいからアボカドを育てている。<br> スターバックスのフラペチーノ用容器で水耕栽培からはじめ、つい最近ベラボン+ガラス鉢に植え替えた。<br> 作業机の近くの窓辺に置いて毎日見守っていると、不思議と情が湧いてくる。</p><p>発芽までは１ヶ月から２ヶ月くらいかかるけど、一度芽が出るとわりとすくすく育つ。</p><blockquote class="twitter-tweet"><p lang="ja" dir="ltr">コロナ禍始まってから育て始めたアボカド。最初は水耕栽培で、今はベラボン。少猫がマジでヤンチャで右側は若葉をかじられてしまった… <a href="https://t.co/8mL9ZBjhHo">pic.twitter.com/8mL9ZBjhHo</a></p>— せーい (@_yshrsmz) <a href="https://twitter.com/_yshrsmz/status/1344517348032581632?ref_src=twsrc%5Etfw">December 31, 2020</a></blockquote><p>ただ分別のない子猫と共生させるのはむずかしい。</p><hr><p>そんなこんなな2020年でした。</p><p>来年もやっていきましょう。</p>',66)]))}const u=e(i,[["render",p]]);export{b as __pageData,u as default};