import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Feed } from 'feed'
import type { SiteConfig } from 'vitepress'
import { createContentLoader } from 'vitepress'
import {
  createExcerpt,
  POST_MARKDOWN_PATTERN,
  sortByDate,
  toPost,
} from './theme/helper'

export async function generateRssFeed(
  siteConfig: SiteConfig,
  hostname: string,
  title: string,
  description: string,
) {
  const posts = await createContentLoader(POST_MARKDOWN_PATTERN, {
    excerpt(file, _options) {
      file.excerpt = createExcerpt(file.content)
    },
    transform(data) {
      return data
        .filter((item) => !item.frontmatter.draft)
        .map((item) => toPost(item))
        .filter((item) => !!item.date)
        .sort((a, b) => sortByDate(a, b))
        .slice(0, 30)
    },
  }).load()

  const feed = new Feed({
    title: title,
    description: description,
    id: hostname,
    link: hostname,
    language: 'ja-JP',
    updated: posts[0].date?.time ? new Date(posts[0].date?.time) : new Date(),
    copyright: 'All rights reserved 2020, yshrsmz',
  })

  for (const post of posts) {
    const link = new URL(post.url, hostname).href
    const time = post.date?.time

    if (!time) {
      continue
    }

    feed.addItem({
      title: post.title,
      id: link,
      link: link,
      description: post.excerpt,
      date: new Date(time),
    })
  }

  await writeFile(resolve(siteConfig.outDir, 'feed.xml'), feed.rss2())
}
