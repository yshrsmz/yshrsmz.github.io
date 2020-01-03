---
layout: post
title: (Android) ネストしたFragmentのonActivityResultが呼ばれない件
category: programming
tags:
  - android
  - java
---

## 現象
```
Activity > Fragment > ViewPager > Fragment
```

という構成にすると`ViewPager`内の`Fragment`で`onActivityResult`が呼ばれなくなってしまう。  
また、`Activity`直下に`Fragment`が複数あると、想定していない`Fragment`の`onActivityResult`が呼ばれてしまう。

例:   
```
Activity > (DrawerFragment + (ParentFragment > ViewPager > ChildFragment))
```  

↑このような構成の時、`ViewPager`内の`ChildFragment`から`startActivityForResult`を呼ぶと、`ChildFragment`の`onActivityResult`が呼ばれないだけでなく、`DrawerFragment`の`onActivityResult`が呼ばれてしまったりする。  
なお、`ParentFragment`の`onActivityResult`も呼ばれない。


## 原因
どの`Fragment`から`Activity`が呼ばれたかは、その`Fragment`が属する`FragmentManager`内のIndexで管理しているようだ。

ネストされた`Fragment`から`Activity`を呼ぶと、`Fragment`のIndexは親`Fragment`の`FragmentManager`(`getChildFragmentManager`で取得する`FragmentManager`)から取得される。 
 
しかし、`Activity#onActivityResult`で呼び出し元のFragmentを判定する時は、`Activity`の`FragmentManager`から対応する`Fragment`を取得しようとするようである。そのため、見当違いの`Fragment`の`onActivityResult`が呼ばれてしまう。

なお、サポートライブラリではそもそも親`Fragment`から子`Fragment`の`onActivityResult`を呼ぶ機能はない模様。

## 対策
よくわからない`Fragment`の`onActivityResult`が呼ばれてしまう件は、とりあえず無視。その`Fragment`に`onActivityResult`を実装していなければ問題ないし、実装している場合もきちんと条件分岐していれば問題ない。

子`Fragment`の`onActivityResult`に関しては、下記のようにして対応する

1. 子`Fragment`で結果を受け取りたい場合は、親`Fragment`の`startActivityForResult`を呼ぶ。
2. 親`Fragment`では`onActivityResult`を受け取れるので、親`Fragment`の`onActivityResult`内で、すべての子`Fragment`の`onActivityResult`を手動で呼ぶ

```java
// BaseFragment.java
protected void callChildOnActivityResult(FragmentManager fm, 
    int requestCode, int resultCode, Intent data) {
    
    List<Fragment> fragments = fm.getFragments();
    if (fragments != null && fragments.size() > 0) {
        for (Fragment fragment : fragments) {
            fragment.onActivityResult(requestCode, resultCode, data);            
        }
    }

}
```

上記のようなメソッドを用意し、必要な箇所(親`Fragment`の`onActivityResult`)で呼ぶとよさげ。

```java
// FooActivity.java
public static void startActivity(Fragment fragment) {
    Intent intent = new Intent(fragment.getActivity(), FooActivity.class);
    
    // 親Fragmentがあれば親Fragmentから呼ぶ
    Fragment parentFragment = fragment.getParentFragment();
    if (parentFragment == null) {
        fragment.startActivityForResult(intent, "fragment_content");
    } else {
        parentFragment.startActivityForResult(intent, "fragment_content");
    }
}
```
`Activity`を開始するときはこんな感じ。
