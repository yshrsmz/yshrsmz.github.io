---
layout: post
title: 複数の DDL ファイルを外部キー依存順に並べて結合するツール、 sqlstitch を作った
tags:
  - SQL
  - Rust
  - sqlstitch
  - GitHub Copilot
---

スキーマ定義をテーブル毎にファイル分割したい、でもなにも考えずに結合するとそのまま流せなくない？　を解決するツール

**目次**
[[toc]]

## レポジトリ

https://github.com/yshrsmz/sqlstitch

## これはなに

端的にいうと、スキーマ定義用の DDL を複数ファイルに分割して管理しているときに、関連順に並び替えて結合してくれるツール。

スキーマが大きくなってくると、メンテナンス性維持のためにたとえば `CREATE TABLE` 単位でファイルを分割したくなる。ただ、ファイルを分割すると今度は実行順序を気にする必要がでてくる。単純に `cat` するとファイル名順で結合されるので、外部キー制約的に無理のない順番になっているとは限らない(というかならないだろう)

そこで `sqlstitch` の出番だ。このツールは結合対象のファイル内の `CREATE TABLE` を解析し、外部キー制約でトポロジカルソートをかけ、その結果を標準出力に表示する。出力された SQL 群はそのまま実行可能な順番にならんでいる。

## 使い方

たとえば `tables` ディレクトリ配下に以下の様な SQL ファイルがあるとする

```sql
-- authors.sql
CREATE TABLE authors (
  author_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(10) NOT NULL,
  PRIMARY KEY (author_id)
);
```

```sql
-- comments.sql
CREATE TABLE comment s(
  comment_id INT NOT NULL AUTO_INCREMENT,
  body TEXT NOT NULL,
  post_id INT NOT NULL,
  PRIMARY KEY (comment_id),
  CONSTRAINT fk_post_id FOREIGN KEY post_id REFERENCES posts (post_id)
);
```

```sql
-- posts.sql
CREATE TABLE posts (
  post_id INT NOT NULL AUTO_INCREMENT,
  body TEXT NOT NULL,
  author_id INT NOT NULL,
  PRIMARY KEY (post_id),
  CONSTRAINT fk_author_id FOREIGN KEY author_id REFERENCES authors (author_id)
);
```

このように３つの sql ファイルがあったとき、

```sh
cat tables/*.sql
```

のように `cat` コマンドを利用すると、単純に名前の順に `accounts.sql`, `comments.sql`, `posts.sql` の順で結合されてしまう。ところが `comments` テーブルは外部キー制約で `posts` テーブルを参照しているので、結合された結果をこのまま DB に流すことはできない。

ここで代わりに `sqlstitch` を使うと、

```sh
sqlstitch tables/*.sql
```

外部キー制約を考慮して、`accounts.sql`, `posts.sql`, `comments.sql` の順で結合したものを出力してくれる、というわけだ。

```sh
sqlstitch tables/*.sql | mysql --host localhost --user root
```

的なこともできる

## なぜ作ったか

開発中の新しいアプリで、DB 周りを sqlc x sqldef でいこう、という話になったから。

sqlc はローカルにある DDL と DML から DB アクセス用のコードを自動生成してくれるし、sqldef はローカルの DDL と DB 上のスキーマを比較して、マイグレーション用の DDL を生成してくれる。

これらを使えば SQL をいわゆる single source of truth として DB 周りを整備できるのでは…? と言う話になったのだ。

ただ sqldef はマイグレーション用 DDL 作成時に[テーブル間の関連を考慮してくれない](https://github.com/sqldef/sqldef/issues/405)ので、こちら側でちゃんとエラーが発生せずに流せる順序に DDL を並べた状態で渡してあげる必要がある。

しかしだからといってスキーマ定義を 1 ファイルでまとめて定義するのは、前述のようにメンテナンス性の観点から避けたい。既存のツールはパッと探した感じだと見当たらなかったので、自分で作ってしまおう、ということになった。

## どう作ったか

せっかくなので気になっていた Rust を採用。

[The Rust Programming Language 日本語版](https://doc.rust-jp.rs/book-ja/) 読みつつ、わからんところは GitHub Copilot Chat に聞きつつ、という感じでシュッと形にすることはできた。

GitHub Copilot Chat は大変優秀で、たまに別ライブラリの構文混ざってきて動かないコードサジェストすることもあるものの、ドキュメント読みながらであればだいたいなんとかなる回答がもらえる。

たとえば、「各テーブルに `CREATE TABLE` が一つずつ格納されたファイルが複数あります。これを外部キーでソートするにはどうしたらいいですか」と質問するとこんな感じになる。

![](https://lh3.googleusercontent.com/pw/ABLVV86tf1YQMhv6SsFncAnnA5RjR6JJeWphuHVra6UnYX-NYs-E42r5e2Yazaf3JyricF65_dDUPB3cmcz1WIihLsfKMJEAjFvE9lcpbu6laoNgHtl8IssImaX8MCYb81VgpVE9Qz1leiiIVRksoiCTrTnUzA=w800)

これで「適当なパーサー使って DDL パースして外部キー制約を取り出す」「取り出した外部キー制約でトポロジカルソートする」ということはわかるので、このそれぞれのステップについて I/F 決めて実装する、あるいは追加で質問していけばいい。完全に GitHub Copilot にお任せ、というよりは質問をベースにこちらで I/F 定義など追加情報を与えていくと、いい感じの成果物をくれそう。

とはいえ細かいところでは雑な箇所もあるので、最終的な真贋を見極めて修正するところはまだ人間の手が必要なイメージだ。

## まとめ

とりあえずこれで必要なユースケースは満たせたものの、現状はいくつか課題がある

- CREATE TABLE しか対応してない
  - ALTER TABLE は無理
  - CREATE VIEW は無理
- ファイル内の並び替えは対応していない

今後は地道にこのへんなおしていく感じかなー。
