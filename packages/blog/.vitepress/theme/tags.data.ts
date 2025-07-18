import type { ContentData } from 'vitepress'
import { createContentLoader } from 'vitepress'
import {
  getPublishedDateFromPath,
  objectHasOwnProperty,
  POST_MARKDOWN_PATTERN,
  rewritePostUrl,
  sortByDate,
} from './helper'
import type { EntriesForTag, Entry } from './types'

declare const data: EntriesForTag[]
export { data }

export default createContentLoader(POST_MARKDOWN_PATTERN, {
  transform(raw: ContentData[]): EntriesForTag[] {
    // group post by frontmatter.tags
    const postsByTag = raw.reduce(
      (acc, post) => {
        if (post.frontmatter.draft) {
          return acc
        }

        const tags: string[] = post.frontmatter.tags ?? []
        for (const tag of tags) {
          if (!objectHasOwnProperty(acc, tag)) {
            acc[tag] = []
          }
          acc[tag].push({
            title: post.frontmatter.title,
            url: rewritePostUrl(post.url),
            date: getPublishedDateFromPath(post.url),
          })
        }

        return acc
      },
      {} as Record<string, Entry[]>,
    )

    return Object.entries(postsByTag)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([tag, posts]) => {
        return {
          tag,
          entries: posts.sort((a, b) => sortByDate(a, b)),
        }
      })
  },
})
