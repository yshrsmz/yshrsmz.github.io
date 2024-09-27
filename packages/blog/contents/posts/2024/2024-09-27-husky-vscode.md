---
layout: post
title: Husky で設定した Git hooks を VSCode でも動くようにする
tags:
  - TIL
  - husky
  - git
---

掲題の通り。レポジトリ内の設定だけだと、VSCode の Source Control からだと動かない

**目次**
[[toc]]

## TL;DR

`~/.config/husky/init.sh` でフック実行前処理を書くことができる.


## くわしく

[Husky](https://typicode.github.io/husky/) をレポジトリの設定だけした状態で VSCode の Source Control を使うと、 pre-commit などのフック自体は実行されるものの、下記のようなエラーがアラートダイアログで表示される。

```
Git: .husky/pre-commit: line 7: pnpm: command not found
```

同アラートダイアログから実行ログを確認すると、さらに細かい情報が見れる

```shell
> git -c user.useConfigOnly=true commit --quiet --allow-empty-message --file -
/Users/yshrsmz/repos/github.com/yshrsmz/sample/.husky/pre-commit: line 7: pnpm: command not found
husky - pre-commit script failed (code 127)
husky - command not found in PATH=node_modules/.bin:/Applications/Xcode.app/Contents/Developer/usr/libexec/git-core:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin
```

私は homebrew からインストールした anyenv 経由で nodenv をインストールし、 Node.js のバージョンを管理している。しかしログからわかるように、 PATH に homebrew のバイナリディレクトリ入ってないし、nodenv のディレクトリも入っていない。なので homebrew と nodenv を PATH に含められればなんとかなりそうな感じ。

Husky 公式サイトの [Troubleshoot](https://typicode.github.io/husky/troubleshoot.html#command-not-found) を見ると、この command not found の解消方法が記載されている。

> ## Startup files
> Husky allows you to execute local commands before running hooks. It reads commands from these files:
> 
> - $XDG_CONFIG_HOME/husky/init.sh
> - ~/.config/husky/init.sh
> - ~/.huskyrc (deprecated)

https://typicode.github.io/husky/how-to.html#startup-files

`~/.config/husky/init.sh` を作ればいいということなので、下記の内容で作成したところ、無事 VSCode からも Git hooks が実行されるようになった。

```sh
if type "/opt/homebrew/bin/brew" > /dev/null; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
fi

eval "$(anyenv init -)"
```
