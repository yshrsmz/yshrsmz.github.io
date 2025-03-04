import { createContentLoader } from 'vitepress'
import type { ContentData } from 'vitepress'
import {
  POST_MARKDOWN_PATTERN,
  createExcerpt,
  sortByDate,
  toPost,
} from './helper'
import type { Post } from './types'

declare const data: Post[]
export { data }

export default createContentLoader(POST_MARKDOWN_PATTERN, {
  excerpt: (file, _options) => {
    file.excerpt = createExcerpt(file.content)
  },
  transform(raw: ContentData[]): Post[] {
    return raw
      .filter(({ frontmatter }) => !frontmatter.draft)
      .map((content) => toPost(content))
      .filter((post) => !!post.date)
      .sort((a, b) => sortByDate(a, b))
  },
})
