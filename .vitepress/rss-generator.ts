import type { SiteConfig } from 'vitepress'
import { createContentLoader } from 'vitepress'
import { Feed } from 'feed'
import { writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { POST_MARKDOWN_PATTERN, createExcerpt, toPost } from './theme/helper'

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
        .sort((a, b) => (b.date.time > a.date.time ? 1 : -1))
        .slice(0, 30)
    },
  }).load()

  const feed = new Feed({
    title: title,
    description: description,
    id: hostname,
    link: hostname,
    language: 'ja',
    updated: new Date(posts[0].date.time),
    copyright: `All rights reserved 2020, yshrsmz`,
  })

  posts.forEach((post) => {
    const link = join(hostname, post.url)
    feed.addItem({
      title: post.title,
      id: link,
      link: link,
      description: post.excerpt ? `${post.excerpt}…` : undefined,
      date: new Date(post.date.time),
    })
  })

  await writeFile(resolve(siteConfig.outDir, 'feed.xml'), feed.rss2())
}
