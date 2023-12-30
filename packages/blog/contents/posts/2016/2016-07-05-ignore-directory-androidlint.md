---
layout: post
title: Android Lintで特定のディレクトリ内ファイルをすべて無視するには
category: programming
tags:
  - TIL
  - Android
---

[Suppressing Lint Warnings - Android Studio Project Site](http://tools.android.com/tips/lint/suppressing-lint-warnings)

Support libraryや他のライブラリからコード持ってきて一部書き換えてるだけだからAndroid Lintの対象にしたくないって時に有効


モジュールのルートに`lint.xml`を置くとAndroid Lintかけるときにそこの設定を見てくれる。  
上のサイトにはプロジェクトのルート、Manifestファイルと同階層に置けって書いてあるけどモジュールのルート(`app/lint.xml`とか)です。

最初は全部のissue書かなきゃなのかなーめんどくさいなーって思ってたら`id="all"`で全部のissueを無視できるらしい

```xml
<?xml version="1.0" encoding="UTF-8"?>
<lint>
    <issue id="all">
        <ignore path="path/to/target/directory"/>
    </issue>
</lint>
```

他にも無視したいメッセージやファイルを正規表現で指定できたり、思ったより高機能でした
