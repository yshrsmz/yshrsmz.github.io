---
layout: post
title: FastDateFormatのタイムゾーンに苦戦した話
category: programming
tags:
  - Java
  - Kotlin
  - TIL
---

Apache Commons Lang の FastDateFormat で

```kotlin
val dateFormat = FastDateFormat.getInstance("yyyy-MM-dd'T'HH:mm:ss.SSSZ", null) // 第２引数は Locale
val date = dateFormat.parse("2022-12-16T15:32:05.403+09:00")
```

に失敗する環境と成功する環境があった。

失敗する環境では

```
Exception in thread "main" java.text.ParseException: Unparseable date: 2022-12-16T15:32:05.403+09:00
	at org.apache.commons.lang3.time.FastDateParser.parse(FastDateParser.java:367)
	at org.apache.commons.lang3.time.FastDateFormat.parse(FastDateFormat.java:550)
```

的なエラーが出る。

調べてみると、失敗する環境は `org.apache.commons:commons-lang3:3.7` を使っていて、成功する環境は `org.apache.commons:commons-lang3:3.3.2` を使っていた。

まあまず間違いなく、なんか更新があったんだろうな〜、ということで[チェンジログ](https://commons.apache.org/proper/commons-lang/changes-report.html)を調べていく

一つずつバージョン上げて動作検証してみると、3.4 からエラーが出るのでそこのエラーを見ていく。(ちなみにエラーはちょっと違って↓のようなゴツい感じ)

```
Exception in thread "main" java.text.ParseException: Unparseable date: "2022-12-16T15:32:05.403+09:00" does not match (\p{Nd}++)\Q-\E(\p{Nd}++)\Q-\E(\p{Nd}++)\QT\E(\p{Nd}++)\Q:\E(\p{Nd}++)\Q:\E(\p{Nd}++)\Q.\E(\p{Nd}++)(GMT[+-]\d{1,2}:\d{2}|[+-]\d{4}|\QACDT\E|\QACST\E|\QACT\E|\QACWST\E|\QADT\E|\QAEDT\E|\QAEST\E|\QAFT\E|\QAKDT\E|\QAKST\E|\QALMT\E|\QAMT\E|\QANAT\E|\QAQTT\E|\QART\E|\QAST\E|\QAstrakhan Standard Time\E|\QAustralian Eastern Daylight Time (Macquarie)\E|\QAWST\E|\QAZOST\E|\QAZOT\E|\QAZT\E|\QBarnaul Standard Time\E|\QBDT\E|\QBNT\E|\QBOT\E|\QBougainville Standard Time\E|\QBRT\E|\QBST\E|\QBTT\E|\QCAT\E|\QCCT\E|\QCDT\E|\QCEST\E|\QCET\E|\QCHADT\E|\QCHAST\E|\QCHOT\E|\QChST\E|\QCHUT\E|\QCKT\E|\QCLST\E|\QCLT\E|\QCOT\E|\QCST\E|\QCVT\E|\QCXT\E|\QDAVT\E|\QDDUT\E|\QEASST\E|\QEAST\E|\QEastern European Summer Time\E|\QEastern European Time\E|\QEAT\E|\QECT\E|\QEDT\E|\QEEST\E|\QEET\E|\QEGST\E|\QEGT\E|\QEST\E|\QFJST\E|\QFJT\E|\QFKT\E|\QFNT\E|\QGALT\E|\QGAMT\E|\QGET\E|\QGFT\E|\QGILT\E|\QGMT\E|\QGMT+02:00\E|\QGMT+03:00\E|\QGMT+04:00\E|\QGMT+05:00\E|\QGMT+07:00\E|\QGMT+13:00\E|\QGMT-03:00\E|\QGST\E|\QGYT\E|\QHDT\E|\QHKT\E|\QHOVT\E|\QHST\E|\QICT\E|\QIDT\E|\QIOT\E|\QIRKT\E|\QIRST\E|\QIST\E|\QJST\E|\QKanton標準時\E|\QKGT\E|\QKirov Standard Time\E|\QKOST\E|\QKostanay Standard Time\E|\QKRAT\E|\QKST\E|\QKyiv夏時間\E|\QKyiv標準時\E|\QLHDT\E|\QLHST\E|\QLINT\E|\QMAGT\E|\QMART\E|\QMAWT\E|\QMDT\E|\QMEST\E|\QMET\E|\QMHT\E|\QMMT\E|\QMSK\E|\QMST\E|\QMUT\E|\QMVT\E|\QMYT\E|\QNCT\E|\QNDT\E|\QNFST\E|\QNFT\E|\QNOVT\E|\QNPT\E|\QNRT\E|\QNST\E|\QNUT\E|\QNZDT\E|\QNZST\E|\QOMST\E|\QORAT\E|\QPDT\E|\QPET\E|\QPETT\E|\QPGT\E|\QPHOT\E|\QPKT\E|\QPMDT\E|\QPMST\E|\QPONT\E|\QPST\E|\QPunta Arenas Standard Time\E|\QPWT\E|\QPYST\E|\QPYT\E|\QQOST\E|\QQYZT\E|\QRET\E|\QROTT\E|\QSAKT\E|\QSAMT\E|\QSaratov Standard Time\E|\QSAST\E|\QSBT\E|\QSCT\E|\QSGT\E|\QSrednekolymsk Time\E|\QSRET\E|\QSRT\E|\QSST\E|\QSYOT\E|\QTAHT\E|\QTFT\E|\QTJT\E|\QTKT\E|\QTLT\E|\QTMT\E|\QTomsk Standard Time\E|\QTOT\E|\QTVT\E|\QULAT\E|\QUlyanovsk Standard Time\E|\QUTC\E|\QUYT\E|\QUZT\E|\QVET\E|\QVLAT\E|\QVOST\E|\QVUT\E|\QWAKT\E|\QWAT\E|\QWEST\E|\QWET\E|\QWFT\E|\QWGST\E|\QWGT\E|\QWIB\E|\QWIT\E|\QWITA\E|\QWSST\E|\QXJT\E|\QYAKT\E|\QYEKT\E|\Qアイルランド標準時\E|\Qアクレ標準時\E|\Qアゼルバイジャン標準時\E|\Qアゾレス夏時間\E|\Qアゾレス標準時\E|\Qアナディリ標準時\E|\Qアピア標準時\E|\Qアフガニスタン時間\E|\Qアマゾン標準時\E|\Qアメリカ中部夏時間\E|\Qアメリカ中部標準時\E|\Qアメリカ太平洋夏時間\E|\Qアメリカ太平洋標準時\E|\Qアメリカ山地夏時間\E|\Qアメリカ山地標準時\E|\Qアメリカ東部夏時間\E|\Qアメリカ東部標準時\E|\Qアラスカ夏時間\E|\Qアラスカ標準時\E|\Qアラビア標準時\E|\Qアルゼンチン時間\E|\Qアルゼンチン標準時\E|\Qアルメニア標準時\E|\Qイスラエル夏時間\E|\Qイスラエル標準時\E|\Qイラン標準時\E|\Qイルクーツク標準時\E|\Qインドシナ時間\E|\Qインドネシア中部時間\E|\Qインドネシア東部時間\E|\Qインドネシア西部時間\E|\Qインド標準時\E|\Qインド洋時間\E|\Qイースター島夏時間\E|\Qイースター島標準時\E|\Qウェーク島時間\E|\Qウォリス・フツナ時間\E|\Qウズベキスタン標準時\E|\Qウラジオストク標準時\E|\Qウランバートル標準時\E|\Qウルグアイ標準時\E|\Qエカテリンブルグ標準時\E|\Qエクアドル時間\E|\Qオムスク標準時\E|\Qオーストラリア中西部標準時\E|\Qオーストラリア中部夏時間\E|\Qオーストラリア中部標準時\E|\Qオーストラリア東部夏時間\E|\Qオーストラリア東部標準時\E|\Qオーストラリア西部標準時\E|\Qカーボベルデ標準時\E|\Qガイアナ時間\E|\Qガラパゴス時間\E|\Qガンビエ諸島時間\E|\Qキューバ夏時間\E|\Qキューバ標準時\E|\Qキルギス時間\E|\Qギルバート諸島時間\E|\Qクック諸島標準時\E|\Qクラスノヤルスク標準時\E|\Qクリスマス島時間\E|\Qグリニッジ標準時\E|\Qグリーンランド東部夏時間\E|\Qグリーンランド東部標準時\E|\Qグリーンランド西部夏時間\E|\Qグリーンランド西部標準時\E|\Qケイシー基地時間\E|\Qココス諸島時間\E|\Qコスラエ時間\E|\Qコロンビア標準時\E|\Qサウスジョージア時間\E|\Qサハリン標準時\E|\Qサマラ標準時\E|\Qサモア標準時\E|\Qサンピエール・ミクロン夏時間\E|\Qサンピエール・ミクロン標準時\E|\Qシンガポール標準時\E|\Qジョージア標準時\E|\Qスリナム時間\E|\Qセーシェル時間\E|\Qソロモン諸島時間\E|\Qタジキスタン時間\E|\Qタヒチ時間\E|\Qチャタム夏時間\E|\Qチャタム標準時\E|\Qチャモロ時間\E|\Qチューク時間\E|\Qチョイバルサン標準時\E|\Qチリ夏時間\E|\Qチリ時間\E|\Qチリ標準時\E|\Qツバル時間\E|\Qデュモン・デュルヴィル基地時間\E|\Qデービス基地時間\E|\Qトケラウ時間\E|\Qトルクメニスタン標準時\E|\Qトンガ標準時\E|\Qナウル時間\E|\Qニウエ時間\E|\Qニューカレドニア標準時\E|\Qニュージーランド夏時間\E|\Qニュージーランド標準時\E|\Qニューファンドランド夏時間\E|\Qニューファンドランド標準時\E|\Qネパール時間\E|\Qノヴォシビルスク標準時\E|\Qノーフォーク夏時間\E|\Qノーフォーク島時間\E|\Qハワイ・アリューシャン夏時間\E|\Qハワイ・アリューシャン標準時\E|\Qハワイ標準時\E|\Qバヌアツ標準時\E|\Qバングラデシュ標準時\E|\Qパキスタン標準時\E|\Qパプアニューギニア時間\E|\Qパラオ時間\E|\Qパラグアイ夏時間\E|\Qパラグアイ標準時\E|\Qピトケアン時間\E|\Qフィジー夏時間\E|\Qフィジー標準時\E|\Qフィリピン標準時\E|\Qフェニックス諸島時間\E|\Qフェルナンド・デ・ノローニャ標準時\E|\Qフォークランド諸島標準時\E|\Qブラジリア標準時\E|\Qブルネイ・ダルサラーム時間\E|\Qブータン時間\E|\Qベネズエラ時間\E|\Qペトロパブロフスク・カムチャツキー標準時\E|\Qペルー標準時\E|\Qホブド標準時\E|\Qボストーク基地時間\E|\Qボリビア時間\E|\Qポナペ時間\E|\Qマガダン標準時\E|\Qマッコーリー島時間\E|\Qマルキーズ時間\E|\Qマレーシア時間\E|\Qマーシャル諸島時間\E|\Qミャンマー時間\E|\Qメキシコ北西部夏時間\E|\Qメキシコ北西部標準時\E|\Qメキシコ太平洋夏時間\E|\Qメキシコ太平洋標準時\E|\Qモスクワ標準時\E|\Qモルディブ時間\E|\Qモーソン基地時間\E|\Qモーリシャス標準時\E|\Qヤクーツク標準時\E|\Qライン諸島時間\E|\Qレユニオン時間\E|\Qロゼラ基地時間\E|\Qロードハウ夏時間\E|\Qロードハウ標準時\E|\Q中国標準時\E|\Q中央アフリカ時間\E|\Q中央ヨーロッパ夏時間\E|\Q中央ヨーロッパ標準時\E|\Q中部ヨーロッパ夏時間\E|\Q中部ヨーロッパ時間\E|\Q仏領ギアナ時間\E|\Q仏領南方南極時間\E|\Q協定世界時\E|\Q南アフリカ標準時\E|\Q台北標準時\E|\Q大西洋夏時間\E|\Q大西洋標準時\E|\Q山地標準時\E|\Q平壌時間\E|\Q日本標準時\E|\Q昭和基地時間\E|\Q東アフリカ時間\E|\Q東カザフスタン時間\E|\Q東ティモール時間\E|\Q東ヨーロッパ夏時間\E|\Q東ヨーロッパ時間\E|\Q東ヨーロッパ標準時\E|\Q東部夏時間\E|\Q東部標準時\E|\Q湾岸標準時\E|\Q英国夏時間\E|\Q西アフリカ標準時\E|\Q西カザフスタン時間\E|\Q西グリーンランド夏時間\E|\Q西グリーンランド時間\E|\Q西ヨーロッパ夏時間\E|\Q西ヨーロッパ時間\E|\Q西ヨーロッパ標準時\E|\Q西部アルゼンチン標準時\E|\Q韓国標準時\E|\Q香港標準時\E)
	at org.apache.commons.lang3.time.FastDateParser.parse(FastDateParser.java:304)
	at org.apache.commons.lang3.time.FastDateFormat.parse(FastDateFormat.java:497)
```

チェンジログ見ているとこの辺があやしそう

[[LANG-1061] FastDateParser error - timezones not handled correctly - ASF JIRA](https://issues.apache.org/jira/browse/LANG-1061)

GitHubミラーレポジトリのコミットはこれ: https://github.com/apache/commons-lang/commit/2367948a0f7bbcf42cb3ef9d97216319a526d3eb

`FastDateTimeParser` に下記差分がある。

```diff
-            sb.append("(GMT[+\\-]\\d{0,1}\\d{2}|[+\\-]\\d{2}:?\\d{2}|");
+            sb.append("(GMT[+-]\\d{1,2}:\\d{2}").append('|');
+            sb.append("[+-]\\d{4}").append('|');
```

ここで、 `+09:00` にマッチしないよう修正が加えられている。ちなみに `GMT+0900` か `+0900` ならマッチする。


## 解決策

最初は FastDateTimeFormat の [JavaDoc](https://commons.apache.org/proper/commons-lang/apidocs/org/apache/commons/lang3/time/FastDateFormat.html) にもある `ZZ` に変えたらいいかなー、とも思ったけど、これだと SimpleDateFormat との互換性がなくなる模様。

3.4 のチェンジログをみていたら 

[[LANG-1101] FastDateParser and FastDatePrinter do not support 'X' format - ASF JIRA](https://issues.apache.org/jira/browse/LANG-1101)

というのも追加されていた。こちらは [SimpleDateFormat でもサポートされている](https://docs.oracle.com/javase/jp/8/docs/api/java/text/SimpleDateFormat.html) ので `X` を採用。

めでたしめでたし
