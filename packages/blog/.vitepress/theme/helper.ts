import type { ContentData } from 'vitepress'
import type { EntryDate, Post, PostDate } from './types'
import { getDate, getMonth, getYear, parseISO } from 'date-fns'

export const POST_MARKDOWN_PATTERN = './contents/posts/*/*.md'

export function rewritePostUrl(url: string): string {
  // convert `/posts/2023/2023-05-31-jest-environment-directory.html` to `/2023/05/31/jest-environment-directory/`
  return url.replace(
    /\/posts\/\d{4}\/(\d{4})-(\d{2})-(\d{2})-(.*)\.html/,
    '/$1/$2/$3/$4/',
  )
}

export function getPublishedDateFromRewrittenUrl(url: string): string | undefined {
  // convert `2023/05/31/jest-environment-directory/` to `2023-05-31`
  if (url.match(/\d{4}\/\d{2}\/\d{2}\/.*\//)) {
    return url.replace(/(\d{4})\/(\d{2})\/(\d{2})\/(.*)\//, '$1-$2-$3')
  }
  return undefined
}

export function getPublishedDateFromPath(filePath: string): PostDate | undefined {
  const file = filePath.split('/').slice(-1)[0]
  const [year, month, date] = file.split('-').slice(0, 3)

  return formatDate(year, month, date)
}

export function getPublishedDateFromGitHubDatetime(
  datetime: string,
): EntryDate | undefined {
  // 2023-12-30T16:12:34Z
  const date = parseISO(datetime)
  return formatDate(
    getYear(date).toString(),
    (getMonth(date) + 1).toString().padStart(2, '0'),
    getDate(date).toString().padStart(2, '0'),
  )
}

function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(+date)
}

function formatDate(year: string, month: string, day: string): EntryDate | undefined {
  const publishedAt = new Date(`${year}-${month}-${day}T00:00:00Z`)
  if (!isValidDate(publishedAt)) {
    return undefined
  }
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

  return `${excerpt}…`
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

export function sortByDate(
  a: { date: PostDate | undefined },
  b: { date: PostDate | undefined },
): number {
  return (b.date?.time ?? 0) > (a.date?.time ?? 0) ? 1 : -1
}

export function hasOwnProperty(obj: unknown, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}
