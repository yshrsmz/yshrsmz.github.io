#!/bin/bash
set -e

# Blog post scaffold script
# Usage: bash scripts/new-post.sh <slug>
# Example: bash scripts/new-post.sh my-new-post

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
POSTS_DIR="$PROJECT_ROOT/packages/blog/contents/posts"

# Get current date
YEAR=$(date +%Y)
DATE=$(date +%Y-%m-%d)

# Check for slug argument
if [ -z "$1" ]; then
  echo "Error: Please provide a slug for the post"
  echo "Usage: pnpm post:new <slug>"
  echo "Example: pnpm post:new my-new-post"
  exit 1
fi

SLUG="$1"

# Validate slug format (kebab-case: lowercase letters, numbers, hyphens)
if ! echo "$SLUG" | grep -qE '^[a-z0-9]+(-[a-z0-9]+)*$'; then
  echo "Error: Slug must be in kebab-case format (lowercase letters, numbers, hyphens)"
  echo "Example: my-new-post, claude-code-review, 2025-wrapup"
  exit 1
fi

# Create year directory if not exists
YEAR_DIR="$POSTS_DIR/$YEAR"
if [ ! -d "$YEAR_DIR" ]; then
  mkdir -p "$YEAR_DIR"
  echo "Created directory: $YEAR_DIR"
fi

# Generate file path
FILENAME="$DATE-$SLUG.md"
FILEPATH="$YEAR_DIR/$FILENAME"

# Check if file already exists
if [ -f "$FILEPATH" ]; then
  echo "Error: File already exists: $FILEPATH"
  exit 1
fi

# Create the post file with frontmatter template
cat > "$FILEPATH" << 'EOF'
---
layout: post
title: ""
category: diary
tags: []
---

**目次**
[[toc]]

EOF

echo "Created: $FILEPATH"
