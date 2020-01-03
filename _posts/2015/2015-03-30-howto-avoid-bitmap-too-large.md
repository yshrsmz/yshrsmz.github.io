---
layout: post
title: (Android) Bitmap too large to 〜が出た時の対処法
category: programming
tags:
  - android
  - java
---

Bitmapを扱っているとたまに下記のようなエラーにぶち当たることがあります。


```
W/OpenGLRenderer: Bitmap too large to be uploaded into a texture(4000x4000, max=2048x2048)
```

読んで字の通り、Bitmapが大きすぎて、OpenGLRendererで取り扱えない。  
限界は縦横2048pxまでのようです。  
解決方法は２つあります。

- 画像を2048x2048まで縮小する
- ハードウェアアクセラレーションを無効にする。

サムネイルとかフルサイズで表示する必要がない時は縮小するのが良さそう。  
ただ、フルスクリーンで画像を表示してピンチズームとかしたい時は２つ目の方法でいきたい。

OS 4.0以降だと各Viewで個別にハードウェアアクセラレーションをOFFにしましょう。

```java
mImageView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
```

ただこれだとメモリ足りなくなる端末もありそうだから、`AndroidManifest.xml`でヒープサイズも設定しておいたほうがいいかも？

```xml
<Application
    android:name="net.yslibrary.android.foo.MainApplication"
    android:label="foo"
    android:largeHeap="true">
```



