import{_ as r,c as o,L as i,e as l,a as e,i as n,h as p,o as h}from"./chunks/framework.B28L1Bbi.js";const q=JSON.parse('{"title":"2024年07-08月振り返り","description":"","frontmatter":{"layout":"post","title":"2024年07-08月振り返り","category":"diary","tags":["diary"],"head":[["link",{"rel":"canonical","href":"https://www.codingfeline.com/2024/09/03/7to8-wrapup/"}],["meta",{"property":"og:url","content":"https://www.codingfeline.com/2024/09/03/7to8-wrapup/"}],["meta",{"property":"og:title","content":"2024年07-08月振り返り"}],["meta",{"property":"twitter:card","content":"summary_large_image"}],["meta",{"property":"twitter:site","content":"@_yshrsmz"}],["meta",{"property":"twitter:creator","content":"@_yshrsmz"}],["meta",{"property":"og:image","content":"https://www.codingfeline.com/2024/09/03/7to8-wrapup/ogp.png"}]]},"headers":[],"relativePath":"2024/09/03/7to8-wrapup/index.md","filePath":"posts/2024/2024-09-03-7to8-wrapup.md","date":{"time":"2024-09-03","string":"September 3, 2024","year":"2024","month":"09","day":"03"}}'),s={name:"2024/09/03/7to8-wrapup/index.md"};function d(m,a,u,c,f,b){const t=p("VPAmazonGoods");return h(),o("div",null,[a[0]||(a[0]=i('<p>2024年の7月-8月を振り返るよ。<br> できれば続けていきたい</p><p><strong>目次</strong></p><nav class="table-of-contents"><ul><li><a href="#仕事">仕事</a></li><li><a href="#個人プロジェクト">個人プロジェクト</a><ul><li><a href="#sincetimer-と-omnitweety-更新した">SinceTimer と Omnitweety 更新した</a></li></ul></li><li><a href="#買った">買った</a><ul><li><a href="#エアコン2台">エアコン2台</a></li><li><a href="#nature-remo-3-nature-remo-lapis">Nature Remo 3, Nature Remo Lapis</a></li><li><a href="#playstation-portal">PlayStation Portal</a></li></ul></li><li><a href="#観た">観た</a><ul><li><a href="#ルックバック">ルックバック</a></li><li><a href="#コードギアス-奪還のロゼ-3-4">コードギアス　奪還のロゼ 3-4</a></li></ul></li><li><a href="#ゲームした">ゲームした</a><ul><li><a href="#祇-path-of-the-goddess">祇: Path of the Goddess</a></li><li><a href="#黒神話-悟空">黒神話: 悟空</a></li></ul></li><li><a href="#その他">その他</a><ul><li><a href="#都知事選行った">都知事選行った</a></li><li><a href="#_8年ぶりに-toeic-受けた">8年ぶりに TOEIC 受けた</a></li><li><a href="#エアコン掃除した">エアコン掃除した</a></li><li><a href="#新しく買ったマットレス、やっぱり体に合わない説">新しく買ったマットレス、やっぱり体に合わない説</a></li></ul></li></ul></nav><h2 id="仕事" tabindex="-1">仕事 <a class="header-anchor" href="#仕事" aria-label="Permalink to &quot;仕事&quot;">​</a></h2><p>体調崩してたのであんま動けなかったなー、という印象。 CI とか CD とか、結構細々としたことばかりやってた。あとはマネジメントとか例のセキュリティ事案起因の全社的な施策とか(めんどい)。</p><p>CI/CD は好きなのでそれはそれでいいし、Node.js のバックエンドも楽しくはあるんだけどやっぱ Android もやりたいなー、とは事あるごとに思う。</p><h2 id="個人プロジェクト" tabindex="-1">個人プロジェクト <a class="header-anchor" href="#個人プロジェクト" aria-label="Permalink to &quot;個人プロジェクト&quot;">​</a></h2><h3 id="sincetimer-と-omnitweety-更新した" tabindex="-1">SinceTimer と Omnitweety 更新した <a class="header-anchor" href="#sincetimer-と-omnitweety-更新した" aria-label="Permalink to &quot;SinceTimer と Omnitweety 更新した&quot;">​</a></h3><p>targetSdkVersion の更新と、billing library の更新と、ダブルで期限が迫っていたのでシュッと片付けた。一番困ったのはまだ一部 jCenter で配布されてるライブラリを使っていたところ。しかもすでにメンテされてないから mavenCentral にも存在しないという。以前から「別のライブラリに移行しなきゃなあ」と思っていたものではあったので、この機会に公式の新しいソリューションに移行した。レイヤードアーキテクチャを採用してたので移行は比較的シンプルだった。こういうライブラリの差し替えでレイヤードアーキテクチャの恩恵を感じたのは初めてかも。</p><p>結果的にシュッと片付いたんだけど、色々ビルド周りカスマイズしてるプロジェクトは一長一短だなーと思った。</p><p>具体的に言うと SinceTimer は Gradle Convention Plugin 作ってマルチモジュールの設定を共通・簡略化している。これ頻繁にメンテしているプロジェクトなら共通化で色々捗るんだけど、一年に一回メンテするようなプロジェクトだと、ビルド周りのコード読み込みしてやってることを思い出したり、1年分のライブラリ更新を Gradle Convention Plugin に落とし込む作業が発生したり、地味にめんどくささが勝る。</p><p>特に Android Studio の移行アシスタントに任せられなかったり公式ドキュメント通りにすんで終わり、といかないのがネック。</p><p>まあどちらのアプリももっとちゃんと機能開発しましょう、という話ではある。やりたいことは結構溜まってるし。</p><h2 id="買った" tabindex="-1">買った <a class="header-anchor" href="#買った" aria-label="Permalink to &quot;買った&quot;">​</a></h2><h3 id="エアコン2台" tabindex="-1">エアコン2台 <a class="header-anchor" href="#エアコン2台" aria-label="Permalink to &quot;エアコン2台&quot;">​</a></h3><p>日立の白くまくんと、ダイキンのやつ。</p><p>寝室の室外機ゴンゴン言い出して、10年目だしそろそろだなあ、と日立のやつに買い替え。白くまくん、運転モード切り替わるタイミングでバカ臭いなあとか思いながら使ってたら、後述する体調の問題でリビングも買い替えることに。</p><p>こう連続でエアコン2台も買うことになるとは思わなかったから家計が火の車である。</p><p>室外機置く場所が狭い関係で換気機能付きのやつ買えなかったのは残念だけど、だいたい満足している。</p><p>あいや、リモコンやスケジュール機能的には全然満足してないな。</p><p>日立もダイキンも、ミッドレンジのエアコンはリモコンの機能が全然充実してなくて、毎日決まった時間のON/OFF設定ができない。どちらも毎日設定する必要があるし、ダイキンに至っては「n時間後にON」みたいな設定しかできない。</p><p>どちらもスマホ用のリモコンアプリを提供してるからそっちならスケジュール設定はできるんだけど、今度は「リモコンアプリから電源をOFFにすると内部クリーン運転が作動しない」とかよくわからない制限があってもう全く役にたたない。</p><p>あと日本の家電メーカーのスマホアプリって、なんでこんなに UX 的にもデザイン的にもイケてないんですかね…。</p><h3 id="nature-remo-3-nature-remo-lapis" tabindex="-1">Nature Remo 3, Nature Remo Lapis <a class="header-anchor" href="#nature-remo-3-nature-remo-lapis" aria-label="Permalink to &quot;Nature Remo 3, Nature Remo Lapis&quot;">​</a></h3><p>というわけで Nature Remo の出番。リモコンの赤外線をコピーしてくれるので、リモコンアプリのような制限はない。ちゃんとリモコン側で設定しておけば、内部クリーン運転もしっかりかかってくれる(Nature Remo は正規のリモコンとして振る舞うわけだからそれはそう)。</p><h3 id="playstation-portal" tabindex="-1">PlayStation Portal <a class="header-anchor" href="#playstation-portal" aria-label="Permalink to &quot;PlayStation Portal&quot;">​</a></h3><p>Amazon の優先販売的なやつで買えた。</p><p>最初はこれいるのかなあ、と思っていたけど実際使い始めるとなかなかどうして捗る。</p><p>おそらくこの端末、複数人で暮らしている人間のほうが良さを感じられるのではないだろうか。</p><p>別の人が PS5 繋いでるディスプレイを利用しているときとか、あるいは仕事部屋で仕事中にちょっと息抜きしようかな、というときに PlayStation Portal がピタリとハマった。</p><p>遅延は我が家の環境だとまったく気にならず、ELDEN RING も黒神話も快適にプレイできている。</p><h2 id="観た" tabindex="-1">観た <a class="header-anchor" href="#観た" aria-label="Permalink to &quot;観た&quot;">​</a></h2><h3 id="ルックバック" tabindex="-1">ルックバック <a class="header-anchor" href="#ルックバック" aria-label="Permalink to &quot;ルックバック&quot;">​</a></h3><p>藤本タツキ先生のやつ。まあもちろん泣いた。</p><p>めちゃくちゃ丁寧に映像化してて動画もすごかった。</p><p>あと来場者特典で原作のネームが丸ごともらえるのもすごい。原作も紙の本買おうかなあ。</p><h3 id="コードギアス-奪還のロゼ-3-4" tabindex="-1">コードギアス　奪還のロゼ 3-4 <a class="header-anchor" href="#コードギアス-奪還のロゼ-3-4" aria-label="Permalink to &quot;コードギアス　奪還のロゼ 3-4&quot;">​</a></h3><p>池袋で BESTIA 上映やってなかったのが残念。</p><p>結末はだいぶ駆け足だった印象。もうちょっと尺がほしかった。 4章は隣りに座ってた人とその前に座ってた人が上映終わったタイミングでマジの号泣してたのが「映画館でしか味わえない空気」で大変良かった。</p><h2 id="ゲームした" tabindex="-1">ゲームした <a class="header-anchor" href="#ゲームした" aria-label="Permalink to &quot;ゲームした&quot;">​</a></h2><h3 id="祇-path-of-the-goddess" tabindex="-1">祇: Path of the Goddess <a class="header-anchor" href="#祇-path-of-the-goddess" aria-label="Permalink to &quot;祇: Path of the Goddess&quot;">​</a></h3><p>ビジュアルは大変好みだったけど、ゲームシステムはあまり惹かれなかった。</p><h3 id="黒神話-悟空" tabindex="-1">黒神話: 悟空 <a class="header-anchor" href="#黒神話-悟空" aria-label="Permalink to &quot;黒神話: 悟空&quot;">​</a></h3><p>絶賛プレイ中。</p><h2 id="その他" tabindex="-1">その他 <a class="header-anchor" href="#その他" aria-label="Permalink to &quot;その他&quot;">​</a></h2><h3 id="都知事選行った" tabindex="-1">都知事選行った <a class="header-anchor" href="#都知事選行った" aria-label="Permalink to &quot;都知事選行った&quot;">​</a></h3><p>選挙はいきましょう。</p><h3 id="_8年ぶりに-toeic-受けた" tabindex="-1">8年ぶりに TOEIC 受けた <a class="header-anchor" href="#_8年ぶりに-toeic-受けた" aria-label="Permalink to &quot;8年ぶりに TOEIC 受けた&quot;">​</a></h3><p>リスニング最初の方ちょい聞き取れなかったかなー、と思ったけど結果は950点で、リスニングは満点だった。 8年前は960点だったから、まあ大体維持できてるなーという感じ。</p><h3 id="エアコン掃除した" tabindex="-1">エアコン掃除した <a class="header-anchor" href="#エアコン掃除した" aria-label="Permalink to &quot;エアコン掃除した&quot;">​</a></h3><p>7月の下旬から喘息の症状悪化して、肺がチリチリするしアレルギーぽい症状があるし大変だった。 かかりつけの病院行ったらなんかの感染症じゃないかな…って薬1週間分もらったけど改善しなくて、「そういえばこの時期よくエアコンで体調崩してたな、去年は大丈夫だったけど」と思い出してエアコン見たら送風ファンがカビまみれで案の定、という感じだった。2022年10月にエアコンの分解洗浄をしていたから去年は大丈夫だったんだなあ。</p>',51)),l(t,{detail:{title:"サンコー ブラシ エアコンすきまの汚れ落とし 抗菌糸 クーラー フィルター グレー 水だけでも汚れが落とせる特殊繊維 びっくりフレッシュ 日本製 BA-58",maker:"Sanko",asin:"B084QBPKHK",imageUrl:"https://m.media-amazon.com/images/I/71JgfK6SfCL._AC_SX679_.jpg"}}),a[1]||(a[1]=e("p",null,"これはめちゃくちゃ便利だった掃除道具。手間はかかるものの送風ファンの羽一枚ずつキレイにできる。謳い文句どおり、水でかなりきれいになった。ほんとはアルコールで殺菌できるといいんだけどね。",-1)),a[2]||(a[2]=e("p",null,"最終的にエアコン買い替えて解決した。 ちゃんと毎年メーカーの掃除頼もう…。",-1)),a[3]||(a[3]=e("h3",{id:"新しく買ったマットレス、やっぱり体に合わない説",tabindex:"-1"},[n("新しく買ったマットレス、やっぱり体に合わない説 "),e("a",{class:"header-anchor",href:"#新しく買ったマットレス、やっぱり体に合わない説","aria-label":'Permalink to "新しく買ったマットレス、やっぱり体に合わない説"'},"​")],-1)),a[4]||(a[4]=e("p",null,"なんか柔らかすぎて背中痛くなるし、寝入り時になんか呼吸止まってるなーって気づいて起きることがよくあるような気がしている。とはいえ妻は逆に仰向けで寝れるようになった、という話をしているしままならないものである。",-1)),a[5]||(a[5]=e("p",null,"次回以降はシングル2枚買うのがよさそう。とりあえずはなにかマットレスパッド買ってしのぐかなあ。あるいは枕をまたジプシーするか。",-1))])}const y=r(s,[["render",d]]);export{q as __pageData,y as default};