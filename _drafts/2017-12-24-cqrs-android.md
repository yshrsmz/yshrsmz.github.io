---
layout: page
title: CQRSで単方向なデータの流れを実現しよう
tags:
  - android
  - kotlin
---

CQRS(Command Query Responsibility Segregation: コマンドクエリ責務分離)は、更新系の処理(Command)と参照系の処理(Query)を分ける実装パターンです。

イベントバスを使って更新完了を通知し、受信側が新しいデータをPullするパターンと、更新が完了すると予め変更通知を購読している場所にdata層から新しいデータが降ってくるパターンがあります。

最近のAndroidにはRxJavaというデータをリアクティブに扱うための強力なツールがあり、またRealmやRoom、OrmaやStorIOといったようなデータベースをリアクティブに扱うことのできるライブラリがたくさん存在します。

こういったツールを使いCQRSを実装するだけでも、FluxやMVIといったアーキテクチャパターンがそのメリットとして挙げている「Unidirectional Data Flow(単方向なデータの流れ)」を実現することができます。
