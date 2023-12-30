import { createContentLoader } from 'vitepress'
import type { ContentData } from 'vitepress'
import type { PostDate } from './types'
import {
  POST_MARKDOWN_PATTERN,
  getPublishedDateFromPath,
  rewritePostUrl,
  sortByDate,
} from './helper'

interface PostsForTag {
  tag: string
  posts: { title: string; url: string; date: PostDate | undefined }[]
}

declare const data: PostsForTag[]
export { data }

function hasOwnProperty(obj: unknown, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export default createContentLoader(POST_MARKDOWN_PATTERN, {
  transform(raw: ContentData[]): PostsForTag[] {
    // group post by frontmatter.tags
    const postsByTag = raw.reduce(
      (acc, post) => {
        if (post.frontmatter.draft) {
          return acc
        }

        const tags: string[] = post.frontmatter.tags ?? []
        tags.forEach((tag) => {
          if (!hasOwnProperty(acc, tag)) {
            acc[tag] = []
          }

          acc[tag].push({
            title: post.frontmatter.title,
            url: rewritePostUrl(post.url),
            date: getPublishedDateFromPath(post.url),
          })
        })

        return acc
      },
      {} as Record<string, PostsForTag['posts'][number][]>,
    )

    return Object.entries(postsByTag)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([tag, posts]) => {
        return {
          tag,
          posts: posts.sort((a, b) => sortByDate(a, b)),
        }
      })
  },
})
