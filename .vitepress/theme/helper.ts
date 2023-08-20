import type { ContentData } from 'vitepress'
import type { Post, PostDate } from './types'

export const POST_MARKDOWN_PATTERN = './contents/posts/*/*.md'

export function rewritePostUrl(url: string): string {
  // convert `/posts/2023/2023-05-31-jest-environment-directory.html` to `/2023/05/31/jest-environment-directory/`
  return url.replace(
    /\/posts\/\d{4}\/(\d{4})-(\d{2})-(\d{2})-(.*)\.html/,
    '/$1/$2/$3/$4/',
  )
}

export function getPublishedDateFromRewrittenUrl(
  url: string,
): string | undefined {
  // convert `2023/05/31/jest-environment-directory/` to `2023-05-31`
  if (url.match(/\d{4}\/\d{2}\/\d{2}\/.*\//)) {
    return url.replace(/(\d{4})\/(\d{2})\/(\d{2})\/(.*)\//, '$1-$2-$3')
  }
  return undefined
}

export function getPublishedDateFromPath(filePath: string): PostDate {
  const file = filePath.split('/').slice(-1)[0]
  const [year, month, day] = file.split('-').slice(0, 3)

  return formatDate(year, month, day)
}

function formatDate(year: string, month: string, day: string): PostDate {
  const publishedAt = new Date(`${year}-${month}-${day}T00:00:00Z`)
  publishedAt.setUTCHours(12)
  return {
    time: `${year}-${month}-${day}`,
    string: publishedAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    year,
    month,
    day,
  }
}

export function createExcerpt(content: string): string | undefined {
  const excerpt = content
    .split('\n')
    .slice(0, 10)
    .filter((line) => line.trim() !== '')[0]

  if (excerpt?.startsWith('<')) {
    return undefined
  }

  return excerpt
}

export function toPost({ url, frontmatter, excerpt }: ContentData): Post {
  return {
    title: frontmatter.title,
    frontmatter,
    url: rewritePostUrl(url),
    excerpt,
    date: getPublishedDateFromPath(url),
  }
}
