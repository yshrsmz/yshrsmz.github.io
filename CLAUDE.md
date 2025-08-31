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
- GitHub Actions deploys to GitHub Pages
- Development branch (`development`) → Production branch (`master`)
- Workflows in `.github/workflows/`:
  - `gh-pages.yml` - Main deployment
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