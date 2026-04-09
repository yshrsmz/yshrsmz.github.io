#!/bin/bash
set -e

# Setup directories with correct ownership
sudo chown -R vscode:vscode /mnt/mise-data
sudo chown -R vscode:vscode "$HOME/.claude"
sudo chown -R vscode:vscode "$HOME/.config"
sudo chown -R vscode:vscode "$HOME/.shell_history"
sudo chown -R vscode:vscode "$HOME/.codex"

# Copy .zshrc
cp .devcontainer/.zshrc "$HOME/.zshrc"

# Copy devcontainer mise config to global mise config
mkdir -p "$HOME/.config/mise"
cp .devcontainer/mise-global.toml "$HOME/.config/mise/config.toml"

mise trust -y
mise trust -y "$HOME/.config/mise/config.toml"

# Disable keyboxd: GnuPG 2.4 の keyboxd は mise の gpg --verify と相性が悪く
# "No public key" エラーになるため、従来の pubring.kbx 形式に戻す。
mkdir -p "$HOME/.gnupg"
chmod 700 "$HOME/.gnupg"
: > "$HOME/.gnupg/common.conf"

mise i

# Setup npm global prefix in user directory
mkdir -p "$HOME/.npm-global"
npm config set prefix "$HOME/.npm-global"

# Install Claude Code CLI
CLAUDE_INSTALL_SCRIPT="$(mktemp -t claude-install-XXXXXX.sh)"
curl -fsSL https://claude.ai/install.sh -o "$CLAUDE_INSTALL_SCRIPT"
bash "$CLAUDE_INSTALL_SCRIPT"
rm -f "$CLAUDE_INSTALL_SCRIPT"

# Install project dependencies
pnpm install --frozen-lockfile
