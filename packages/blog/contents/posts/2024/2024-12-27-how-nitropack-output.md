---
layout: post
title: Nitro がどこで成果物内の node_modules を生成するか
tags:
  - TIL
  - Node.js
  - Nitro
  - Rollup
---

`Nitro` ってどうやって `node_modules` 内の必要なものだけを `.output` に持ってきてるんだろう

**目次**
[[toc]]

`nitro` コマンドの build の実装を見ると下記のようになっている

```ts
  async run({ args }) {
    const rootDir = resolve((args.dir || args._dir || ".") as string);
    const nitro = await createNitro(
      {
        rootDir,
        dev: false,
        minify: args.minify,
        preset: args.preset,
      },
      {
        compatibilityDate: args.compatibilityDate as DateString,
      }
    );
    await prepare(nitro);
    await copyPublicAssets(nitro);
    await prerender(nitro);
    await build(nitro);
    await nitro.close();
  },
```

https://github.com/nitrojs/nitro/blob/1767019c04a44238fe14e6cce8dacd50595a5092/src/cli/commands/build.ts#L37-L53


つまり `prepare`, `copyPublicAssets`, `preprender`, `build` のいずれかのメソッドが目的の実装であろう


### prepare

https://github.com/nitrojs/nitro/blob/1767019c04a44238fe14e6cce8dacd50595a5092/src/core/build/prepare.ts

ここでは出力先ディレクトリの削除と再作成を行っている

### copyPublicAssets

https://github.com/nitrojs/nitro/blob/1767019c04a44238fe14e6cce8dacd50595a5092/src/core/build/assets.ts

`noPublicDir` オプションが有効なら処理をスキップ。

nitro.config.ts で設定した `publicAssets` ディレクトリから、必要な asset を出力先ディレクトリにコピー。

で、必要に応じて(`compressPublicAssets` が true なら)圧縮も行う。


### prerender

https://github.com/nitrojs/nitro/blob/1767019c04a44238fe14e6cce8dacd50595a5092/src/core/prerender/prerender.ts

`noPublicDir` オプションが有効なら処理をスキップ。

[prerender](https://nitro.build/config#prerender) が有効な route をビルド時に描画する。静的に生成するってこと。

### build

https://github.com/nitrojs/nitro/blob/1767019c04a44238fe14e6cce8dacd50595a5092/src/core/build/build.ts

本番向けビルドでは、 `buildProduction()` に処理を移譲している。

### buildProduction

https://github.com/nitrojs/nitro/blob/1767019c04a44238fe14e6cce8dacd50595a5092/src/core/build/prod.ts

色々やってるけど、

```ts
  if (!nitro.options.static) {
    nitro.logger.info(
      `Building ${nitroServerName(nitro)} (preset: \`${nitro.options.preset}\`, compatibility date: \`${formatCompatibilityDate(nitro.options.compatibilityDate)}\`)`
    );
    const build = await rollup.rollup(rollupConfig).catch((error) => {
      nitro.logger.error(formatRollupError(error));
      throw error;
    });

    await build.write(rollupConfig.output);
  }
```

静的でないときのみに実行するここが怪しい。  
rollup でビルドしてるので、 `rollupConfig` がどうなってるか見るとよさそう。`rollupConfig` は前述の `build.ts` で取得している。

### getRollupConfig

https://github.com/nitrojs/nitro/blob/1767019c04a44238fe14e6cce8dacd50595a5092/src/rollup/config.ts

色々 rollup plugin の設定を書いている。

が、package.json の dependencies にある rollup plugin など見ると、そのへんの処理をしているものはなさそう。

```
    "@rollup/plugin-alias": "^5.1.1",
    "@rollup/plugin-commonjs": "^28.0.2",
    "@rollup/plugin-inject": "^5.0.5",
    "@rollup/plugin-json": "^6.1.0",
    "@rollup/plugin-node-resolve": "^15.3.1",
    "@rollup/plugin-replace": "^6.0.2",
    "@rollup/plugin-terser": "^0.4.4",
    "@rollup/pluginutils": "^5.1.4",
```

https://github.com/nitrojs/nitro/blob/1767019c04a44238fe14e6cce8dacd50595a5092/package.json#L102-L109

ということで nitro 内製の rollup plugin がそれっぽい。

…というふうに読み進めて行ってたら、別口で答えを見つけた

[Bundle `dist/node_modules` · Issue #276 · unjs/unbuild](https://github.com/unjs/unbuild/issues/276#issuecomment-1640557493)

> As an alternative idea, we might extract nitro externals plugin to generate dist/node_modules but it seems a super tricky thing at the moment so i don't think we can plan it early. But i will certainly keep your issue in mind 👍🏼


ということでやっぱり nitro 内製の externals plugin が対象の処理でよさそう。

### externals

https://github.com/nitrojs/nitro/blob/1767019c04a44238fe14e6cce8dacd50595a5092/src/rollup/plugins/externals.ts


ここで externals 扱いするか、 inline でバンドルするか決めているらしい。

しかしログを仕込んで動かしてみても、モノレポ内の別パッケージはこの externals plugin まで来ない模様。

ここよりも前の段階で処理されてそうな気がするけど、その変理解するにはまず rollup plugin の仕組みをちゃんと知る必要がありそう…

ということで今回はここまで。
