---
layout: post
title: (Android) キーボードの表示切り替えを検知する
categories:
  - programming
tags:
  - android
---

Androidではキーボードの表示・非表示の切り替えを判定するイベントは、標準では用意されていません。  
そこで、自前でキーボードの表示状態を判定する必要があります。

日本語のドキュメントを探したところ、LinearLayout等を拡張し、`onMeasure`でディスプレイの高さとビューの高さを比較する実装の記事をいくつか発見しました。

しかし、この方法だと全レイアウトを拡張したものを用意せねばならず、効率的ではありません。

この記事では、`ViewTreeObserver`を利用したもう少しイケてる実装方法を紹介します。

コードとしては以下のとおりです。


```java
public interface OnKeyboardVisibilityListener {
  public void onVisibilityChanged(boolean isVisible);
}

public final void setKeyboardListener(final OnKeyboardVisibilityListener listener) {
  final View activityRootView = ((ViewGroup)getActivity().findViewById(android.R.id.content)).getChildAt(0);

  activityRootView.getViewTreeObserver().addOnGlobalLayoutListener(new OnGlobalLayoutListener() {

    private boolean wasOpend;
    
    private final Rect r = new Rect();
    
    @Override
    public void onGlobalLayout() {
      activityRootView.getWindowVisibleDisplayFrame(r);
      
      // 画面の高さとビューの高さを比べる
      int heightDiff = activityRootView.getRootView().getHeight() - r.height();
        
      boolean isOpen = heightDiff > 100;
      
      if (isOpen == wasOpened) {
          // キーボードの表示状態は変わっていないはずなので何もしない
          return;
      }
        
      wasOpened = isOpen;
      
      listener.onVisibilityChanged(isOpen);
    }   
  })
}
```

Activityに記述することを想定していますが、Activityが取得できればFragmentでもどこでも構いません。
`getWindowVisibleDisplayFragme(Rect)`で、ビューが配置されているディスプレイのサイズが取得できます。  
`android.R.id.content`直下の一つ目の子要素を取得することで、ユーザーがいじれる一番外側のビューを取得できます。  
基本的にはActivityのレイアウトXMLで記述している`FrameLayout`や`LinearLayout`、`RelativeLayout`のような要素です。

`onGlobalLayout`はレンダリング後に呼ばれるので、ここでディスプレイの高さと実際のビューの高さを比べることで画面にビュー以外の「何か」が表示されているかどうか判定することができます。

ここでは、差が100ピクセルもあれば、その表示されている「何か」はキーボードだろうと仮定しています。
(2015/7/16追記: コードでは100ピクセル決め打ちしていますが、実際には100sp(ディスプレイ解像度にあった値)で検知するのがよいです)

この記述をActivityの基礎クラスにでも書いておけば、それを継承するすべてのActivityで使用することができます。
ViewGroup系のクラスを拡張する必要がないので、非常にコードやレイアウトXMLが綺麗になると思います。

サンプルのコードではinterfaceを利用したコールバック形式で書いていますが、[Otto](http://square.github.io/otto/)のようなイベントバスライブラリを利用してもいいと思います(私も実業務ではOttoと組み合わせて使用しています)。

こちらからは以上です。

参考: [How to check visibility of software keyboard in Android? - Stack Overflow](http://stackoverflow.com/questions/2150078/how-to-check-visibility-of-software-keyboard-in-android)
