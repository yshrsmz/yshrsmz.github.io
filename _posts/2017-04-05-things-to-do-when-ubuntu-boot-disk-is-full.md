---
layout: post
title: (Ubuntu) /bootの容量がなくなった時にすること
categories:
  - programming
tags:
  - til
  - ubuntu
---

# [Ubuntu] /bootの容量がなくなった時にすること

## TL;DR

古いカーネルを削除する

## すること

1. 現在のカーネルを確認する

```shell
$ uname -r
```

2. インストール済みの古いカーネルを確認する

```shell
$ dpkg -l linux-{image,headers}-"[0-9]*" | awk '/^ii/{ print $2}' | grep -v -e `uname -r | cut -f1,2 -d"-"` | grep -e '[0-9]'
```

上記コマンドで出てきたリストに、現在のカーネルが含まれないことを確認

3. apt-getでpurge

2で得た一覧を`apt-get purge`に食わせる

```shell
dpkg -l linux-{image,headers}-"[0-9]*" | awk '/^ii/{ print $2}' | grep -v -e `uname -r | cut -f1,2 -d"-"` | grep -e '[0-9]' | xargs sudo apt-get -y purge
```

以上。

---
### 参考
- [How do I free up more space in /boot? - Ask Ubuntu](http://askubuntu.com/questions/89710/how-do-i-free-up-more-space-in-boot)



