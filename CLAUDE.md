# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog/website (CodingFeline) built with VitePress and hosted on GitHub Pages. It's a monorepo using pnpm workspaces containing the main blog and supporting tools.

## Common Development Commands

### Development
```bash
# Start development server
pnpm blog:dev

# Build the site
pnpm blog:build

# Preview production build
pnpm blog:preview
```

### Code Quality
```bash
# Run linting checks
pnpm lint

# Fix linting issues
pnpm lint:fix
```

### Package-specific Commands
```bash
# Update recent contributions
pnpm --filter @codingfeline/recent-contributions start

# Run tests (recent-contributions package)
pnpm --filter @codingfeline/recent-contributions test

# Package action-create-scrap for GitHub Actions
pnpm --filter @codingfeline/action-create-scrap package
```

## Architecture & Structure

### Monorepo Layout
- `/packages/blog/` - Main VitePress blog application
- `/packages/action-create-scrap/` - GitHub Action for creating scrap posts
- `/packages/recent-contributions/` - Tool to fetch GitHub contributions
- `/packages/eslint-config/` - Shared ESLint config (deprecated, uses Biome now)

### Content Organization
- Blog posts: `/packages/blog/contents/posts/YYYY/MM/DD/post-title.md`
- Scraps (short posts): `/packages/blog/contents/scraps/`
- Products: `/packages/blog/products/`
- Privacy policies: `/packages/blog/products/privacy-policy/`

### Key Technologies
- **VitePress** - Static site generator
- **Vue 3** - Frontend framework
- **Tailwind CSS v4** - Styling with typography plugin
- **TypeScript** - Type safety
- **Biome** - Linting and formatting (replaces ESLint/Prettier)
- **pnpm** - Package management with workspaces

### Important Configuration
- **VitePress Config**: `/packages/blog/.vitepress/config.ts`
  - OGP image generation
  - RSS feed generation
  - URL rewrites for clean URLs
  - GTM and AdSense integration (production only)
- **Biome Config**: `/biome.jsonc` - Code formatting rules
- **Node Version**: v22.17.1 (managed by mise in `/mise.toml`)

### Deployment
- GitHub Actions deploys to GitHub Pages via the official `actions/upload-pages-artifact` +
  `actions/deploy-pages` workflow (Pages source = `GitHub Actions`, not a branch)
- A push to `development` builds the site and deploys it as a Pages artifact — there is no
  longer a `master` branch in the deployment loop (the old `peaceiris/actions-gh-pages` orphan
  branch method was retired)
- Workflows in `.github/workflows/`:
  - `gh-pages.yml` - Main deployment (build job + deploy job with `github-pages` environment)
  - `ci.yml` - CI checks
  - `recent-contributions.yml` - Updates contributions
  - `_create-scrap.yml` - Creates scrap posts

### Custom Features
- **OGP Image Generator**: Auto-generates social media preview images
- **RSS Feed**: Generated during build
- **Scraps**: Quick posts via GitHub Action
- **Recent Contributions**: Fetches GitHub activity
- **Product Widgets**: Kindle and Amazon product displays

## Development Notes

- All dependencies are pinned for stability
- Renovate handles dependency updates
- Code style enforced by Biome (2 spaces, single quotes, semicolons as needed)
- Vue files have relaxed linting for unused imports/variables
- Production builds include Google Analytics and AdSense

## Persisting Learnings: use `.claude/rules/` instead of auto memory

This repository runs inside a devcontainer. While the `/home/vscode/.claude` directory is mounted on a named Docker volume so auto memory technically survives rebuilds, persisting engineering preferences and project conventions as **git-tracked files under `.claude/rules/*.md` is strongly preferred** over the standard auto memory system.

When you would normally save a `feedback` / `project` / `reference` type memory:

- **Do NOT write to** `/home/vscode/.claude/projects/.../memory/` (auto memory).
- **Instead, write to** `.claude/rules/<topic>.md` in this repository, then commit it.
- Each rule file should state the rule, a **Why** section, and a **How to apply** / **PR review** section (same structure as memory entries).
- Keep one rule per file, named descriptively (e.g. `prefer-root-cause-fixes.md`).

Benefits:
- Persists across devcontainer rebuilds and volume resets.
- Git-tracked, reviewable, and shared across sessions / machines.
- Automatically picked up by the `github:review-pr-rules` agent for PR compliance checks.
- Discoverable by other contributors and future Claude sessions.

**Reusable workflows** (multi-step procedures, not single-rule preferences) should go under `.claude/skills/<skill-name>/SKILL.md` with the standard frontmatter, following the existing `snapshot-testing`, `major-upgrade`, and `baseline-diff` skills as templates.

The auto memory system may still be used for transient `user`-type facts discovered within a session, but anything you want to survive long-term belongs in `.claude/rules/` or `.claude/skills/`.

## Writing Style

- When mixing Japanese and English text, always insert a half-width space between them
  - 例: "LiveData から StateFlow に移行" (correct)
  - 例: "LiveDataからStateFlowに移行" (incorrect)
- This applies to all combinations: Japanese-English, English-Japanese, and around code/technical terms
- Use the proper three-dot leader character '…' instead of three periods '...' in Japanese text
  - 例: "焦った…" (correct)
  - 例: "焦った..." (incorrect)
  - In English contexts, '...' is acceptable
- Use backticks `` for inline code references, error messages, and log outputs instead of Japanese quotation marks 「」
  - 例: "`SavedStateRegistry#performRestore` ってエラーが出た" (correct)
  - 例: "「SavedStateRegistry#performRestore」ってエラーが出た" (incorrect)
  - Use 「」 only for regular quotations in Japanese text