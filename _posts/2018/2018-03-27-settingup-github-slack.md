---
layout: post
title: SlackのGitHub integrationで色々流れてこない時にすること
category: programming
tags:
  - til
  - slack
  - GitHub
---

ちょっと前にGitHubのSlack integrationがリニューアルした。これは新しいSlack Appのリリースとして実施されたので、[古いもの](https://slack.com/apps/A0F7YS2SX-github-notifications-legacy)から[新しいもの](https://slack.com/apps/A8GBNUWU8-github)への乗り換えが必要。

あたらしいAppは`/github`コマンドを使って、Slackのチャンネル画面から対話形式で設定を行う。

たとえば通知を受け取るレポジトリを新しく追加するときは`/github subscribe owner/repo`みたいな感じ。

ただこれを実行するだけだと問題があった。プルリクエストについたレビューやコメント等が通知されてこないのだ。

調べてみるとこの[GitHub Appのレポジトリ](https://github.com/integrations/slack)があって、そこに[細かい設定方法が記載してあった](https://github.com/integrations/slack#configuration)。

>### Configuration
> You can customize your notifications by subscribing to activity that is relevant to your Slack channel, and unsubscribing from activity that is less helpful to your project.
>
>### Configuration
>You can customize your notifications by subscribing to activity that is relevant to your Slack channel, and unsubscribing from activity that is less helpful to your project.
>
>Settings are configured with the `/github` slash command:
>
>```
>/github subscribe owner/repo [feature]
>/github unsubscribe owner/repo [feature]
>```
>
>These are enabled by default, and can be disabled with the `/github unsubscribe owner/repo [feature]` command:
>
>- `issues` - Opened or closed issues
>- `pulls` - New or merged pull requests
>- `statuses` - Statuses on pull requests
>- `commits` - New commits on the default branch (usually `master`)
>- `deployments` - Updated status on deployments
>- `public` - A repository switching from private to public
>
>These are disabled by default, and can be enabled with the `/github subscribe owner/repo [feature]` command:
>
>- `reviews` - Pull request reviews
>- `comments` - New comments on issues and pull requests
>- `branches` - Created or deleted branches
>- `commits:all` - All commits pushed to any branch
>
>You can subscribe or unsubscribe from multiple settings at once. For example, to turn on activity for pull request reviews and comments:


要約すると、単に`/github subscribe owner/repo`するとレビューやコメント、ブランチの作成/削除、デフォルトでないブランチへのコミットは通知されないらしい。

これらの通知機能を有効にするには、`/github subscribe owner/repo reviews`のように、subscribeするときに有効にしたい機能名を渡したらいい。

(とはいえ有効にしたあとも流れてこないことがあるような気がしなくもない…)
