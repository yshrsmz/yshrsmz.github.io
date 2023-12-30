---
layout: post
title: Synology の NAS を Plex の Media Server にする
category: diary
tags:
  - NAS
  - Synology
  - Plex
---

個人ディレクトリにある動画を見れるようにするまで

## 環境

- [Synology DiskStattion DS216play](https://amzn.to/3P8TjJh)
- DSMバージョン: `DSM 7.1-42661 Update 3`

## Plex Media Server パッケージをダウンロード

公式サイト( https://www.plex.tv/media-server-downloads/ ) からダウンロード。  
プラットフォームは `Synology (DSM7)` で、パッケージは x16 シリーズ向けの ARMv7。

## NAS にパッケージをインストール

DSM を開き、パッケージセンターからダウンロードしたパッケージを手動インストール。

初回は通常インストールではなく新規インストール用を選んで、Plex のページから取得した token を設定する。

## Plex Media Server に個人ディレクトリを見れるよう権限を与える。

そのままだと、 `/homes` ディレクトリ配下は見れないのでひと手間必要。
Plex のユーザは `PlexMediaServer` という internal system user なので、ユーザ設定からは見えない。

File Station から `/homes` ディレクトリを選択して右クリック、プロパティを表示する。

許可タブから作成をクリック。  
ユーザまたはグループから　`PlexMediaServer` を検索 & 選択。  

許可から `読み取り` をチェック。

編集もできたほうがいいので、その後 Plex に追加したいディレクトリで、同様の手順で `書き込み` を許可しておく。

## 参照

- [DSM 7 - Plex Media Server - Release Info & Migration instructions](https://forums.plex.tv/t/dsm-7-plex-media-server-release-info-migration-instructions/653717/18)
