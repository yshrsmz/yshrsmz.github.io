---
layout: post
title: Wakatimeでプロジェクトの名前を指定する
category: programming
tags:
  - til
---

[Wakatime](https://wakatime.com)はプログラミングしている時間を集計して、プロジェクト毎・言語毎にグラフ化してくれるツールです。

AtomやSublimeText, Jetbrains製の各種IDE、Eclipse, Vim等[様々なエディタのプラグイン](https://wakatime.com/editors)を提供しているので、言語毎にエディタを使い分けている方でも大体カバーできるんじゃないかと思います。

私の場合はAndroid Studio, IntelliJ IDEA, Atomで利用しています。

一週間毎に今週はどのプロジェクトでどのくらいコーディングしましたよー、っていうレポートを送ってくれるので週次の振り返りに重宝します。あとは大体の工数把握に使ったりとか。  
[Omnitweetyを作った時](http://yslibrary.net/2015/11/10/omnitweety-andrid-released-share-url-twitter/)も、wakatimeでコーディングした時間管理してました

集計時のプロジェクト名ですが、大体はフォルダ構造から自動で取得してくれるのですが、たまにうまく取得できず一つのプロジェクトが複数の名前で分けて集計されてしまったりします。

任意の名前でまとめられないのかなーって調べてたら、[公式のFAQにしっかりと記述がありました](https://wakatime.com/help/faq/general#set-project-name)

Wakatimeでは３つの方法でプロジェクト名を指定できるそうです。

1. git, subversion等のバージョン管理システムを利用する
   `git init` で初期化したフォルダの下が一つのプロジェクトとして認識されるようです。プロジェクト名はトップのフォルダ名です。 
   
2. Wakatimeサイト上の[設定ページ](https://wakatime.com/settings/preferences)
   ファイルパスにこの文字列が含まれていたらこのプロジェクト、というような細かい条件でプロジェクト名を設定することができます。
   
3. `.wakatime-project` ファイルを作成する。
   プロジェクトディレクトリに `.wakatime-project` ファイルを作成し、一行目に利用したいプロジェクト名を書くと、その文字列がそのディレクトリ以下のプロジェクト名として利用されます。
   

とりあえず `.wakatime-project` ファイルを作る方法が一番環境による影響をうけないので良さそうです。gitにコミットしておけば、複数の環境で開発している時も安心です。
