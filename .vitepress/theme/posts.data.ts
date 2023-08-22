import { createContentLoader } from 'vitepress'
import type { ContentData } from 'vitepress'
import type { Post } from './types'
import {
  POST_MARKDOWN_PATTERN,
  createExcerpt,
  getPublishedDateFromPath,
  rewritePostUrl,
} from './helper'

declare const data: Post[]
export { data }

export default createContentLoader(POST_MARKDOWN_PATTERN, {
  excerpt: (file, _options) => {
    file.excerpt = createExcerpt(file.content)
  },
  transform(raw: ContentData[]): Post[] {
    return raw
      .filter(({ frontmatter }) => !frontmatter.draft)
      .map(({ url, frontmatter, excerpt }) => {
        return {
          title: frontmatter.title,
          frontmatter,
          url: rewritePostUrl(url),
          excerpt,
          date: getPublishedDateFromPath(url),
        }
      })
      .sort((a, b) => (b.date.time > a.date.time ? 1 : -1))
  },
})
