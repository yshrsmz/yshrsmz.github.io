---
layout: post
title: ChromeのタブからMarkdown記法のリンクを生成する拡張機能、Tabs2Linksを作った
category:
  - programming
tags:
  - chrome-extension
  - javascript
  - vuejs
  - tabs2links
---

ブログ書く時に参考サイトのタイトルやらURLやらまとめるのがめんどくさいので作ったよ。  
インストールは[こちら](https://chrome.google.com/webstore/detail/tabs2links/hlmnkbgbionilbjkgmghmdeokakmojmi)。

![screenshot01](https://lh3.googleusercontent.com/6taxF3PWVDgMkHkQaYSwHhZf8AuW6bs3ITsqOnSH2bTr01iFnrTxft-_LjGOqPFRvT8OiKgHfF7xw5nEgL8XmjxkGPJIntb2UlxOs5Vg7MqFrDTBDy7SNCwVpNVd3vKheAIRmXYksnIFoW-B5wxjvEpJJHWmcIjjOrQAwKsv5a64e3i3GZDazsD8yHnG8dQ-vTM0E4zXzDEBLES82EG7dN-alvejmpv3u1w03YJlWreFCnBh7x94q3X0JK6aXP4qwOiWRk6ZOZ87mpXcPuX4sprvyYYIXoHeZveGfsFRGiDLa2Mugd9YTNwcXjRQhu5zFMUrg089gQFzNtGkBd-iSnTA97XIbOBtuuwGS7s-dbTAzNee6nckJ1sKLX0IHhOnNzQqvTeJBuiSid91JfNSiB3w96Wgdx3X7N9z9sWlAVTZ5nWF-74BtOv6V2vXgJAVzXh7Z6rYGX6Gz9k0pIzxh6puhP4VRFYdQv4a74VUzD9SiaioRv9QEO9kqwE7o0Ou75FZ9jfaYQTqmS4oWyO0iXiLoX5W09ySx1CVS30HwWqCv0Z-le6jRi3wu3x1wxp2D_nyJkQmHkYcdAhpMe2CtJw1x3HuaW0DflXO4kPGhrN7gxXy7rsFU88g5eWUEb4VOvX4hkKkkB_nO--T-hy9GaCQ6SWFQGs=w800)

アイコンから拡張機能を起動すると、こんな感じで現在のWindow内のタブが一覧で表示される。  
ここでどのタブを出力に含めるか選択することができる。

![screenshot02](https://lh3.googleusercontent.com/18HVIpbm_XZx4FSe4WjVPusLa6IeO-eGAbNRTBxdyOXx6G4NfU9xZVvnPoCQtXpcNn3X9l8PWrriU2YuaFPJFLvCJJR5VFDbhxLz5-z2-qlog5fCWNkbMX08VBfllAvSNV1tFezxZmXUGtC8mbNV81K-rDc4E7V8THDrHIsU6Jzoe6RnlNcgnSfDZkE8eZ_nJb9W2lQdoi3T-XiFsevVgS-pxjMnVLqTcN0FUk41qm5f7_q8w6qdh18l7viR42q076FpMiW2L9YedE2r-B-bSIV5BGRd7nCi_CX8k-tqxjX3A9ZtwAa4RsSroOjJ5AWbztrB5cNAf8WGmjO04opyaHLjfN8I0auT42tqO-kYloi0vDBUX5FWDYbZT3Yrcmqqk03STSGN7oVdX9Mpn-s6BW57j1BgVXp9rEHLamXCNvl_Qc7RZ7-tuwhIx4LhIXt9ZJ_2G1GNTCfEhdQkHYn1xjYeJHEokcaJQwTVUug1rXtXx8cMTQ8ccESUMJZGpbZcKsOSwxVrzaV5CPnVXe1v6HjLTbDTAl-rlv_CSkMuxlBFhJ--3IYmZUBd6sBQMIr73pSli_k9RjunwQsTfnsgp7--TPvqJKIv8psbMmDD1Yxmnd0H-82qzqJky7siO7NJ3kD685yz8_a1ZztYkF2JP74DcDcnsJ4=w800)

"Output"タブを選択すると、各タブのタイトルとURLがMarkdown記法でフォーマットされた文字列が表示される。  

出力したいサイトをまとめたウィンドウ作ってコピペ、って使い方を想定。  
もちろんチェックボックスぽちぽちしてもいい。

あとでHTML形式の出力に対応したい気持ちもある。  
ユーザが自由にカスタマイズできるようにするのも面白そうだけど、そこまでやるかは未定。  
あとアイコンが雑すぎるのでどうにかしたい。

## 使った技術とか。

今回はTypeScript x Vuex x BootstrapVueで開発している。

AndroidDagashiのサイトをNuxt.jsで作ってて手に馴染んでいるっていうのもあるけど、やっぱりVue.jsは使いやすい。  
UIフレームワークはBootstrapVueで、これは特に強い理由があるわけでもないけど、Vuetifyとか使ってガッツリ「アプリケーション」な見た目にする必要もないかなあ、という感じ。  
コードは[GitHubで公開している](https://github.com/yshrsmz/chrome-tabs2links)ので気になった方はぜひ確認してみてほしい。

## リンク

- [Tabs2Links - Chrome ウェブストア](https://chrome.google.com/webstore/detail/tabs2links/hlmnkbgbionilbjkgmghmdeokakmojmi)
- [yshrsmz/chrome-tabs2links](https://github.com/yshrsmz/chrome-tabs2links)
- [Android Dagashi](https://androiddagashi.github.io/)
- [BootstrapVue](https://bootstrap-vue.js.org/)
