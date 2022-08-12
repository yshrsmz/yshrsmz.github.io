---
layout: post
title: Git の コミットハッシュからブランチ名を取得する
category: programming
tags:
  - Git
  - TIL
---

CI は基本的に detached HEAD で実行されるので、 reg-suit などブランチ上で実行されること前提なツールを使う場合は、どうにかしてブランチ名を取得してチェックアウトしなおす必要がある。


結論から言うと、[`git name-rev`](https://git-scm.com/docs/git-name-rev) コマンドを使う。

```
$ git name-rev 740e99b1d53c3276736ab6806027c980d1fef8c6
```


などとコミットハッシュを与えてと実行すると

```
740e99b1d53c3276736ab6806027c980d1fef8c6 tags/v20220812.1 feature/awesome-feature
```

という具合にブランチ名が取得できる。ブランチ名だけでよければ `--name-only` を追加して


```
$ git name-rev --name-only 740e99b1d53c3276736ab6806027c980d1fef8c6
```

と実行する。

ただこれ、一つ盲点がある。同じコミットハッシュに __タグ__ と __ブランチ__ が両方存在すると、タグが返ってきてしまう。

対策は簡単で、 `--refs` オプションを利用してブランチ名のみ取得するようなパターンを与えてあげればよい


```
$ git name-rev --name-only --refs="refs/heads/*" 740e99b1d53c3276736ab6806027c980d1fef8c6
```

こんな感じ。
