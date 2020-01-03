---
layout: post
title: CircleCIでDocker v1.10.0を使う
category: programming;
tags:
  - docker
  - circleci
  - til
---

※ CircleCI v2.0でDockerに完全対応したので、以下の情報は古いです
===

CircleCIに入ってるDocker、ちょっとバージョンが古いみたいで`docker run`とか`docker pull`とかすると`hub.docker.com`ではなく`docker.io`に見に行ってしまいます。

で、`docker.io`はすでに廃止されているので`docker.com`にリダイレクトされ、`docker.com`の下に指定したimageがあるかどうか確認してしまうので、下記のようなエラーになってしまいます。

```shell
Pulling repository docker.io/yshrsmz/docker-whale
Tag latest not found in repository docker.io/yshrsmz/docker-whale
```

で、どうにか新しいDocker使いたいな〜と思っていろいろ試してたら、公式フォーラムで発見しました。

[Docker 1.10.0 is available(Beta)](https://discuss.circleci.com/t/docker-1-10-0-is-available-beta/2100)

記事自体は2016年2月のもので、これを書いてる時点でもう9ヶ月前です。  
ただ、現状これより新しいものは見当たらないのでCircleCIで使えるDockerは2016年11月現在v1.10.0が最新のようです。

circle.yml的にはこんな感じ

```
machine:
  pre:
    - curl -sSL https://s3.amazonaws.com/circle-downloads/install-circleci-docker.sh | bash -s -- 1.10.0
  services:
    - docker 
```
パラメータでバージョン指定してるから`1.12.3`とか指定したら新しいの使えるかな…？って思ったら無理でした。ファイル見たら`1.10.0`の分岐しかなかったです。

CircleCIではDockerにパッチを当てて使っているようですが、v1.10.0で使っていたLXC exec driverが削除されてしまったのでアレなことになっているみたいです。
