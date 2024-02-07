---
layout: post
title: GitKraken で Husky の Git Hooks と連携できるようにする
tags:
  - TIL
  - GitKraken
---


**目次**
[[toc]]

## TL;TR

GitKraken は相対パスな `core.hooksPath` に対応してないので、絶対パスにする必要がある

## どうやる

この辺が参考になる

- [Support core.hooksPath - GitKraken](https://feedback.gitkraken.com/suggestions/191601/support-corehookspath)
- [Husky v5 and Gitkraken · Issue #875 · typicode/husky](https://github.com/typicode/husky/issues/875)
- [Husky + GitKraken = 💥 · Issue #243 · typicode/husky](https://github.com/typicode/husky/issues/243)

GitKraken の Git Hooks サポートは機能のリリース当初から壊れていて、絶対パスしか認識してくれない。

GitKraken の `Preferences > Git Hooks` から絶対パスに修正したらちゃんと pre-commit フックなど走るようになるんだけど、依存関係更新したりして package.json の `prepare` フックが実行されると(だいたいここで `husky` コマンド叩いて husky インストールしてるはず) `core.hooksPath` が相対パスにリセットされてしまう。

解決策は簡単で、 `husky` コマンドに絶対パスで `core.hooksPath` を設定させたらいい。

Husky の実装を見ると、コマンドの引数に hooks へのパスを渡せるようになっている

https://github.com/typicode/husky/blob/095a4fefbb6b9e57f22bd96f3db0577f5ed427b3/index.mjs#L13

```js
export default (d = '.husky') => {
	if (process.env.HUSKY === '0') return 'HUSKY=0 skip install'
	if (d.includes('..')) return '.. not allowed'
	if (!f.existsSync('.git')) return `.git can't be found`

	let _ = (x = '') => p.join(d, '_', x)
	let { status: s, stderr: e } = c.spawnSync('git', ['config', 'core.hooksPath', `${d}/_`])
	if (s == null) return 'git command not found'
	if (s) return '' + e

	f.mkdirSync(_(), { recursive: true })
	w(_('.gitignore'), '*')
	f.copyFileSync(new URL('husky', import.meta.url), _('h'))
	l.forEach(h => w(_(h), `#!/usr/bin/env sh\n. "\${0%/*}/h"`, { mode: 0o755 }))
	w(_('husky.sh'), '')
	return ''
}
```

なので package.json の prepare フックを下記の様に修正してあげると、 `config.hooksPath` に GitKraken でも認識できる絶対パスが渡せる

```json
"scripts": {
  "prepare": "husky \"$(pwd)/.husky\""
}
```

もう3年くらい放置されている問題なので、そろそろ修正してほしい
