---
layout: post
title: Public ECR を GitHub Actions から使ったときの toomanyrequests について
category: programming
tags:
  - TIL
  - GitHub Actions
  - AWS
---

最近仕事で AWS CodeBuild で動いていたコンテナイメージのビルドジョブを、GitHub Actions に移行している。

だいたいビルドは通るのだけど、たまに下記のようなエラーで失敗することがある

```shell
Step 4/33 : FROM public.ecr.aws/docker/library/node:18.16 AS build-stage
18.16: Pulling from docker/library/node
toomanyrequests: Rate exceeded
```

まあ見ての通り、 Public ECR 上の node イメージを pull しようとして Rate Limit に引っかかっている。

しかし、 Public ECR は DockerHub がイメージの pull に制限をかけたことをきっかけに生まれたとものなので、基本無制限のハズでは？　と思っていた。

ところがよくよく調べてみると、 pull が無制限なのは "AWS 上で動いているものから使う時のみ" だったようだ。


AWS の [Public ECR ローンチ時のブログ記事](https://aws.amazon.com/blogs/aws/amazon-ecr-public-a-new-public-container-registry/)にはこのように書かれている

> Anyone who pulls images anonymously will get 500 GB of free data bandwidth each month, after which they can sign up or sign in to an AWS account to get more. Simply authenticating with an AWS account increases free data bandwidth up to 5 TB each month when pulling images from the internet.
>
> Finally, workloads running in AWS will get unlimited data bandwidth from any region when pulling publicly shared images from ECR Public.


また、[Public ECR の service quota](https://docs.aws.amazon.com/AmazonECR/latest/public/public-service-quotas.html)にも、下記のような記載がある

- Rate of authenticated image pulls: Each supported Region: 10 per second
- Rate of unauthenticated image pulls: Each supported Region: 1 per second

未認証の場合だと pull は1秒に1回なので、そりゃタイミングによってはエラーになるなあ、という感じ。

## 解決策

### 1. Docker Hub のイメージを使う

どうやら GitHub Actions の GitHub-hosted Runner から利用するぶんには、DockerHub の Rate Limit には引っかからないらしい、というのを [GitHub の issue で見つけた](https://github.com/actions/runner-images/issues/1445#issuecomment-713861495)(ただし Public なイメージに限る)。なので今回はこちらの方法を採用。

しかし self-hosted runner を使う場合は DockerHub の制限に引っかかるのでまた対策が必要。

### 2. authenticated user として pull する。

DockerHub のイメージを使うことにしたから試してないが、前述の記事やドキュメントを見る限りだと、AWS ユーザとして認証したら Rate Limit がかなり緩和されるはず。

## 参考

- [Amazon Elastic Container Registry Public: A New Public Container Registry - AWS News Blog](https://aws.amazon.com/blogs/aws/amazon-ecr-public-a-new-public-container-registry/)
- [Amazon ECR Public service quotas - Amazon ECR Public](https://docs.aws.amazon.com/AmazonECR/latest/public/public-service-quotas.html)
- [Did Dockerhub rate limit affect Github Action? · Issue #1445 · actions/runner-images](https://github.com/actions/runner-images/issues/1445#issuecomment-713861495)
