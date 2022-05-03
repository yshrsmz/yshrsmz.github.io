---
layout: post
title: GitHub Pages のデプロイを push-dir から peaceiris/actions-gh-pages に移行した
category: programming
tags:
  - GitHub
  - GitHub Actions
  - GitHub Pages
---

掲題の通り。  
[push-dir](https://github.com/L33T-KR3W/push-dir) のメンテが止まってる & [脆弱性がある](https://github.com/advisories/GHSA-926x-m6m5-3mmp) ということで、重い腰を上げて [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) に移行した。


```yml
- name: Deploy website
  run: |
    git remote add upstream https://${{ secrets.PUSH_ACCESS_TOKEN} }@github.com/${{ secrets.USER_NAME }}/${{ secrets.REPO_NAME }}.git
    yarn push-dir --dir=packages/site/dist --remote=upstream --branch=master --clearnup --verbose
```

これが

```yml
- name: Deploy website
  uses: peaceiris/actions-gh-pages@v3
  with:
    personal_token: ${{ secrets.PUSH_ACCESS_TOKEN }}
    publish_dir: ./packages/site/dist
    publish_branch: master
    force_orphan: true
```

こうなった。

[peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) は `secrets.GITHUB_TOKEN` でのデプロイにも対応している。


ただ、ちょっと試した感じだと `secrets.GITHUB_TOKEN` だとデプロイ完了後の `page_build` イベントがトリガーされず、後処理の別のワークフローが動かなかったので push-dir のときと同様に PAT を利用している。

そのうちトークンは PAT から [tibdex/github-app-token](https://github.com/tibdex/github-app-token) に移行したい。
