---
layout: post
title: (Android) ButterKnife 7.0への移行ガイド
categories:
  - programming
tags:
  - android
  - java
---

2015/06/28、[ButterKnife](https://github.com/JakeWharton/butterknife)の7.0.0がリリースされました。  
6.x系からAPIの変更が何点かあるので、簡単に移行手順をまとめます

## アノテーション
### `@InjectView/@InjectViews` -> `@Bind`

Viewを変数にひもづけるアノテーションが、`@Bind`に変更になりました。  
複数の場合も`@Bind`です。とりあえず全部置換しましょう。

### `@Optional`の廃止

レイアウトに存在しないかもしれないViewの時、今までは`@Optional`を利用していましたが、7.0からは`@Nullable`を使います。support-annotationsライブラリの`@Nullable`でも、別のライブラリの`@Nullable`でも構わないようです。

## メソッド名
下記のように変更になっています。

`ButterKnife.inject` -> `ButterKnife.bind`  
`ButterKnife.reset` -> `ButterKnife.unbind`


## Proguard設定
ButterKnifeによって自動生成されるクラス名が`FooActivity$$ViewInjector`から`FooActivity$$ViewBinder`に変更されたので、Proguard設定も変える必要があります。  
下記のようになります。

```
-keep class butterknife.** { *; }
-dontwarn butterknife.internal.**
-keep class **$$ViewBinder { *; }

-keepclasseswithmembernames class * {
    @butterknife.* <fields>;
}

-keepclasseswithmembernames class * {
    @butterknife.* <methods>;
}
```

## 新しく追加された機能
### Resource Binding

stringやbool, color等のxmlに定義されたリソースを変数にバインド出来るようになりました。  
下記のアノテーションを使います。

- `@BindBool`: `R.bool`を`boolean`にバインド
- `@BindColor`: `R.color`を`int/ClorStateList`にバインド
- `@BindDimen`: `R.dimen`を`int`(ピクセルサイズ)あるいは`float`(正確な数値)にバインド
- `@BindDrawable`: `R.drawable`を`Drawable`にバインド
- `@BindInt`: `R.int`を`int`にバインド
- `@BindString`: `R.string`を`String`にバインド


こちらからは以上です。

参考: [butterknife/CHANGELOG.md at master · JakeWharton/butterknife](https://github.com/JakeWharton/butterknife/blob/master/CHANGELOG.md)
