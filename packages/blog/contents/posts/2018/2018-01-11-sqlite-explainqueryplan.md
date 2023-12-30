---
layout: post
title: SQLiteでインデックスが使われているかどうか確認する
category: programming
tags:
  - TIL
  - sqlite
---

```sql
explain query plan SQL_QUERY;
```

でクエリ実行計画を確認できる。

 ```sql
CREATE TABLE IF NOT EXISTS `bank` 
  (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
    `bank_code` TEXT NOT NULL, 
    `name` TEXT NOT NULL, 
    `kana` TEXT NOT NULL
  );
```

たとえばこういうテーブルがあったときに`bank_code`でデータを取得するクエリの実行計画を見てみると、下記のようになる。

```
explain query plan select * from bank where bank_code = "0001"

selectid    order       from        detail          
----------  ----------  ----------  ----------------
0	    0           0	    SCAN TABLE bank
```

`bank_code`にインデックスを追加すると、下記のようになる

```sql
CREATE UNIQUE INDEX `index_bank_bank_code` ON `bank` (`bank_code`)
```

```
explain query plan select * from bank where bank_code = "0001"

selectid    order       from        detail          
----------  ----------  ----------  ----------------
0	    0           0	    SEARCH TABLE bank USING INDEX index_bank_bank_code (bank_code=?)
```

`explain SQL_QUERY`でもクエリがどのように実行されているかを確認することができる。  
SQLのパフォーマンスを検証したいときには便利そう

## 参考
- [Primary Keys, Query Planning, and Binary Search](https://medium.com/@JasonWyatt/squeezing-performance-from-sqlite-indexes-indexes-c4e175f3c346)
- [EXPLAIN QUERY PLAN](https://www.sqlite.org/eqp.html)
- [The SQLite Bytecode Engine](http://www.hwaci.com/sw/sqlite/opcode.html)
