---
layout: post
title: AWS CodeBuild 用に Java11 で Android がビルドできる Docker イメージをつくる
category: programming
tags:
  - Android
  - Docker
  - AWS
  - CodeBuild
---

CodeBuild の提供するイメージでは最新の Android アプリがビルドできないので、自分でなんとかする必要がある。

2022年8月現在、[CodeBuild 公式の利用可能ランタイム一覧](https://docs.aws.amazon.com/codebuild/latest/userguide/available-runtimes.html) だと、Android は API 28, 29 のみ記載がある。

GitHub の [aws/aws-codebuild-docker-images](https://github.com/aws/aws-codebuild-docker-images) にもいくつか issue がたっている。

- [Using Android Images (runtime 28+29) does not work anymore as Android Tools require Java 11 and the images require Corretto 8 · Issue #537](https://github.com/aws/aws-codebuild-docker-images/issues/537)
- [Android version 31, AGP 7 support · Issue #496](https://github.com/aws/aws-codebuild-docker-images/issues/496)


[issue 537](https://github.com/aws/aws-codebuild-docker-images/issues/537) の方に書いてあるように BuildSpec で Android SDK インストールしてもいいんだけど、せっかくなので Docker イメージ作ってみる。

こんな感じ。

```docker
FROM public.ecr.aws/amazoncorretto/amazoncorretto:11

ENV ANDROID_SDK_ROOT /opt/android-sdk-linux
ENV PATH="${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools:/opt/bin:${PATH}"

RUN yum install -y \
    wget \
    unzip \
    && rm -rf /var/cache/yum/* \
    && yum clean all

# install Android

RUN mkdir -p /opt/android-sdk-linux/cmdline-tools \
    && cd /opt/android-sdk-linux/cmdline-tools \
    && wget -q https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip -O /opt/android-sdk-linux/cmdline-tools/latest.zip \
    && unzip latest.zip \
    && mv cmdline-tools latest \
    && rm -f latest.zip

RUN echo y | sdkmanager \
    "build-tools;33.0.0" \
    "platform-tools" \
    "platforms;android-32"
```

ついでに Node.js 使えるようにしたかったので、 nodenv も追加してみるとこうなる。

```docker
FROM public.ecr.aws/amazoncorretto/amazoncorretto:11

ENV ANDROID_SDK_ROOT /opt/android-sdk-linux
ENV PATH="/root/.nodenv/bin:/root/.nodenv/shims:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools:/opt/bin:${PATH}"

RUN yum install -y \
    git \
    wget \
    unzip \
    gzip \
    tar \
    && rm -rf /var/cache/yum/* \
    && yum clean all

# install Android

RUN mkdir -p /opt/android-sdk-linux/cmdline-tools \
    && cd /opt/android-sdk-linux/cmdline-tools \
    && wget -q https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip -O /opt/android-sdk-linux/cmdline-tools/latest.zip \
    && unzip latest.zip \
    && mv cmdline-tools latest \
    && rm -f latest.zip

RUN echo y | sdkmanager \
    "build-tools;33.0.0" \
    "platform-tools" \
    "platforms;android-32"

# install Node.js

RUN wget -q https://raw.githubusercontent.com/nodenv/nodenv-installer/master/bin/nodenv-installer -O- | bash && \
    eval "$(nodenv init -)"
```

---
定期的に Android SDK と node-build の更新のために Docker イメージビルドし直さなきゃいけないのがめんどくさい。  
やはり Java11 入ってる公式イメージ使いつつ、 BuildSpec で Android SDK インストールするのが楽な気がする.
