---
layout: post
title: AndroidのNavigation Barの色とアイコンの色を変える
category: programming
tags:
  - TIL
  - Android
---

`styles.xml`の該当のスタイルに下記を追加するだけ。

```
<item android:name="android:windowNavigationBarColor">@style/some_color</item>
```

Navigation Barを明るめの色の色にして、アイコンを暗くしたいときはさらに下記を追加。

```
<item android:name="android:windowLightNavigationBar">true</item>
```

ただしこれはAPI27で追加されたプロパティなので注意。  
API27未満ではデフォルトの黒いNavigation Barにするとか割り切りが必要。  
あとアイコンの色に黒・白以外の選択肢はない。

最近リリースされた[GoogleのTodoリストアプリ](https://play.google.com/store/apps/details?id=com.google.android.apps.tasks)も、API27未満は黒いNavigation Barで、API27以降でのみNavigation Barを白くしている。  
ちなみにStatus Barの方はもうちょっと前のAPIからアイコンの色を黒くできる。
