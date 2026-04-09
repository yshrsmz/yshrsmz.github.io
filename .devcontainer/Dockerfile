FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

ARG DEBIAN_FRONTEND=noninteractive

# Locale setup
ENV TZ=Asia/Tokyo \
    LANG=ja_JP.UTF-8 \
    LANGUAGE=ja_JP:ja \
    LC_ALL=ja_JP.UTF-8

RUN apt-get update && \
    apt-get install -y --no-install-recommends locales && \
    sed -i 's/# ja_JP.UTF-8 UTF-8/ja_JP.UTF-8 UTF-8/' /etc/locale.gen && \
    locale-gen ja_JP.UTF-8 && \
    update-locale LANG=$LANG && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    chsh -s /bin/zsh vscode

# Install mise (pinned version, installed system-wide)
ARG MISE_VERSION=v2026.4.0
RUN install -d -o vscode -g vscode /opt/mise && \
    curl -fsSL https://mise.run | MISE_VERSION=${MISE_VERSION} MISE_INSTALL_PATH=/usr/local/bin/mise sh && \
    chmod +x /usr/local/bin/mise

USER vscode
