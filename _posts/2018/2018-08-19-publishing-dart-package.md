---
layout: post
title: DartのPackage(ライブラリ)を公開する
category:
  - programming
tags:
  - Dart
---

[unorm_dart](https://pub.dartlang.org/packages/unorm_dart)というDartのPackageを公開したので公開周りのフローをまとめます。

`pub publish --dry-run` を実行するといい感じにいろいろ教えてくれます。たとえばこんな感じ。

```
Publishing unorm_dart 0.1.0 to https://pub.dartlang.org:
|-- .gitignore
|-- .idea
|   |-- codeStyles
|   |   |-- Project.xml
|   |   '-- codeStyleConfig.xml
|   '-- saveactions_settings.xml
|-- CHANGELOG.md
|-- LICENSE
|-- README.md
|-- analysis_options.yaml
|-- example
|   '-- unorm_dart_example.dart
|-- lib
|   |-- src
|   |   |-- composite_iterator.dart
|   |   |-- decomposite_iterator.dart
|   |   |-- iterator.dart
|   |   |-- recursive_decomposite_iterator.dart
|   |   |-- uchar.dart
|   |   |-- uchar_iterator.dart
|   |   |-- unorm_dart_base.dart
|   |   |-- unormdata.dart
|   |   '-- utils.dart
|   '-- unorm_dart.dart
|-- pubspec.yaml
'-- test
    |-- normalization_test.dart
    '-- unorm_dart_test.dart
Missing requirements:
* Your pubspec.yaml is missing a "homepage" field.
Sorry, your package is missing a requirement and can't be published yet.
For more information, see: https://www.dartlang.org/tools/pub/cmd/pub-lish.
```

表示される内容は以下の通り

- 公開するパッケージの名称、バージョン、公開先(基本的にpub.dartlang.orgのはず)
- 公開するパッケージに含まれるファイル
- 公開するために足りない要件

一番最後の項目を潰していけば公開できるようになります。  
今回の場合だと、`pubspec.yaml`にhomepageフィールドが足りないようです。homepageフィールドを追加してもう一度 `pub publish --dry-run` すると下記のようになります。

```
Publishing unorm_dart 0.1.0 to https://pub.dartlang.org:
|-- .gitignore
|-- .idea
|   |-- codeStyles
|   |   |-- Project.xml
|   |   '-- codeStyleConfig.xml
|   '-- saveactions_settings.xml
|-- CHANGELOG.md
|-- LICENSE
|-- README.md
|-- analysis_options.yaml
|-- example
|   '-- unorm_dart_example.dart
|-- lib
|   |-- src
|   |   |-- composite_iterator.dart
|   |   |-- decomposite_iterator.dart
|   |   |-- iterator.dart
|   |   |-- recursive_decomposite_iterator.dart
|   |   |-- uchar.dart
|   |   |-- uchar_iterator.dart
|   |   |-- unorm_dart_base.dart
|   |   |-- unormdata.dart
|   |   '-- utils.dart
|   '-- unorm_dart.dart
|-- pubspec.yaml
'-- test
    |-- normalization_test.dart
    '-- unorm_dart_test.dart

Package has 0 warnings.
```

これで公開できるはずです。

また、このときPackageに入れたくないファイルが含まれていないか確認しましょう。Packageに含まれないファイルは下記の通りです。

- `packages` ディレクトリ(Dart2系では使われていないはず)
- このPackageのロックファイル(`pubspec.lock`)
- Gitを使っていなければ、すべての隠しファイル(`.`から始まるファイル)
- Gitを使っていれば、`.gitignore`に指定されているファイル


つまり、基本的にGitで管理しているファイルはすべて公開されるパッケージに含まれます。公開されたくないものはレポジトリに入れないようにしましょう。  
今回の場合だと、本来IntelliJの設定フォルダである `.idea` はPackageに入れたくないのですが、コードスタイルの設定はレポジトリで共有したいのでやむなく含まれています。

用意ができたら `pub publish` で公開します。

```
Publishing unorm_dart 0.1.0 to https://pub.dartlang.org:
|-- .gitignore
|-- .idea
|   |-- codeStyles
|   |   |-- Project.xml
|   |   '-- codeStyleConfig.xml
|   '-- saveactions_settings.xml
|-- CHANGELOG.md
|-- LICENSE
|-- README.md
|-- analysis_options.yaml
|-- example
|   '-- unorm_dart_example.dart
|-- lib
|   |-- src
|   |   |-- composite_iterator.dart
|   |   |-- decomposite_iterator.dart
|   |   |-- iterator.dart
|   |   |-- recursive_decomposite_iterator.dart
|   |   |-- uchar.dart
|   |   |-- uchar_iterator.dart
|   |   |-- unorm_dart_base.dart
|   |   |-- unormdata.dart
|   |   '-- utils.dart
|   '-- unorm_dart.dart
|-- pubspec.yaml
'-- test
    |-- normalization_test.dart
    '-- unorm_dart_test.dart

Looks great! Are you ready to upload your package (y/n)?
```

`y` を入力

```
Pub needs your authorization to upload packages on your behalf.
In a web browser, go to https://accounts.google.com/o/oauth2/auth?access_type=XXXXXXXXXXXXXX
Then click "Allow access".

Waiting for your authorization...
```

WebブラウザでアクセスするためのURLが表示されるので、ブラウザを開きます。Packageを公開するにはGoogleアカウントが必要で、そのための承認作業です。

無事アカウントの認証ができると、こんな画面が表示されます。ターミナルに戻ると公開処理が完了しているはずです。

![authorized](https://lh3.googleusercontent.com/fnNkbwhsAV9gfc2p8AdvDclZYGzWuCwIdkiBFI7-hjCusG45S6LWbmVS2dUxjHTImSDmW8aQ6Lzy8PZ-s_9G7tcRd3_ryL7cW_FtCvb00663yjliPfOfZ5OsvgvvvJhPx9Cd7ICxNLZI4Ygx8ciVrH-WUJtWcOZ9OU7H2cFFpqeSRyya9zEXdjRyALCdM1QFFBS6hS4AgIP4ZNHHhh9tnPHDXwQvaptRj2TqJTq85DG6jLJwy1TWHIP_zdKjxq7CwyZZftzQxwYbFQJB6kRnnc2quVPCMj136cMJwvdcmcNxwyizfoAbiCvsYDlTMp9GnsaSD6g8dzPot-aB54-I1LYWT1xAv5dT8s_aYXUBIQF2VwmxyRJf0_nXYkOFcWk1XF3IIpWbhL__Sse7IKbN204sflXXIi3MkwmYuo2mFmYjSrpts52E_CWNExrIhotZAKEZ9nkBtqpWnSaUM2cyl_Nv37W3iZNlI72yXVXIwDokU0D9caYgpOX6C5NQ69B1d7e15NcVpfZaU_Q24XYOP2Tj_EiSL-vEJbLaHDXX0wh2Dbhj2XGfmqBV34LgjJLH9gyM2CXvFKcACxMV_831O01qLrRFnBZnsDhHKiOylPGZQmAXOOxKRjnzdslKCFk73_qmBqDTh9cCCyTm3nHQpNPvPfGEO0Zo2unV7dZyRf38sPpXPdkz9g=w900)

```
Authorization received, processing...
Successfully authorized.
Uploading... (3.4s)
Successfully uploaded package.
```

30分くらい？待つと [https://pub.dartlang.org](https://pub.dartlang.org) で検索に表示されるようになります。

---

Dartのパッケージ公開、本当に楽でした。ほぼCLIで終わってしまうのはちょっと感動です。  
今までJavaのライブラリ開発をいくつかしていて、bintrayやmaven centralに公開したこともあるのですが、その時の作業とは比べものにならないほどのお手軽さでした。

今作ろうとしているサービスをFlutter/Dartで実現するためには必要なものがいくつもあるので、ちょこちょこコミュニティにPackageという形で貢献できたらなあ、と思います。


### 参考
- [Publishing a Package \| Dart](https://www.dartlang.org/tools/pub/publishing)
- [Pubspec Format \| Dart](https://www.dartlang.org/tools/pub/pubspec)
- [Pub Package Layout Conventions \| Dart](https://www.dartlang.org/tools/pub/package-layout)
