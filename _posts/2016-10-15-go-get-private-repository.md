---
layout: post
title: go getでprivate repositoryを取得するには
category:
  - programming;
tags:
  - golang
  - til
---

```
$ go get github.com/some/private/repository
```

って普通にやってももちろん取れず。

`~/.netrc`に設定を追加する必要がある。

```
machine github.com
  login {your_github_username}
  password {github_token}
```

`github_token`はgithubの設定画面から取得できるトークンのこと。

`~/.netrc`の権限を`600`に変えたら、あとはprivate repositoryでも`go get`できた。
