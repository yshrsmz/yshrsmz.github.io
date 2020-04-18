---
layout: post
title: "GitHub Actionsでworkflowからpushしたときに後続のworkflowが起動しなくなった件"
category: programming
tags:
  - GitHub Actions
  - til
---

GitHub Actionsを使ってGitHub Pagesを運用している。
定期的にあるAPIから情報を取得して、更新があったらレポジトリにpushする。そしてそのpushをトリガーにしてGitHub Pagesにサイトをデプロイする、というフロー。

これがついさっきいろいろコードを更新してたら動かなくなった。
自分でpushするときはデプロイ用のworkflowが動くけど、workflowからpushするときは動かないのだ。

動き的には、GitHub Actions動かすと自動で設定されるアクセストークンを利用している時のような動作だ。このトークンは、無限ループを防ぐためにpush時にworkflowがトリガーされない。

しかし、workflowの設定ファイルを見ても自分で用意した別のアクセストークンを利用している。

GitHubのフォーラムを探してみると、そのもの[ズバリなトピック](https://github.community/t5/GitHub-Actions/Push-from-action-even-with-PAT-does-not-trigger-action/td-p/46232)があった。

結論から言うと、 `actions/checkout` をv2に更新したのが原因だった。
v2からは後続のgitコマンドで、デフォルトのアクセストークンが使われるような設定になっていたのだ。

ということで `actions/checkout@v2` の設定に `persist-credentials: false` を設定したら復旧した

```yaml
- name: Checkout
  uses: actions/checkout@v2
  with:
    persist-credentials: false
```

### 参考

- [actions/checkout: Action for checking out a repo](https://github.com/actions/checkout)
- [Solved: Re: Push from action (even with PAT) does not trig... - GitHub Community Forum](https://github.community/t5/GitHub-Actions/Push-from-action-even-with-PAT-does-not-trigger-action/td-p/46232)

