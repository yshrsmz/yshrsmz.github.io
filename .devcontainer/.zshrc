
# npm global prefix and local bin
export PATH="$HOME/.local/bin:$HOME/.npm-global/bin:$PATH"

# History configuration
HISTFILE="$HOME/.shell_history/.zsh_history"
HISTSIZE=10000
SAVEHIST=10000
setopt SHARE_HISTORY
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_SPACE

# configure GITHUB_TOKEN
if command -v gh >/dev/null 2>&1; then
  export GITHUB_TOKEN="$(gh auth token 2>/dev/null)"
fi

eval "$(mise activate zsh)"

# fzf key bindings (Ctrl+R for history search, Ctrl+T for file search, Alt+C for cd)
eval "$(fzf --zsh)"

# Starship config (no-nerd-font preset for devcontainer portability)
export STARSHIP_CONFIG="/workspaces/yshrsmz.github.io/.devcontainer/starship.toml"
eval "$(starship init zsh)"
