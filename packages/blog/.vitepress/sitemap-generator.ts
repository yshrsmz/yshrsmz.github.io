import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'
import { SitemapStream } from 'sitemap'
import type { PageData, SiteConfig } from 'vitepress'

// https://github.com/vuejs/vitepress/issues/520#issuecomment-1566062351
export class SitemapGenerator {
  private links: { url: string; lastmod?: string }[] = []

  onTransformPageData(pageData: PageData) {
    const relativePath = pageData.relativePath.replace(
      /((^|\/)index)?\.md$/,
      '$2',
    )

    this.links.push({
      url: relativePath,
      lastmod: pageData.date?.time,
    })
  }

  async onBuildEnd(siteConfig: SiteConfig) {
    const sitemap = new SitemapStream({
      hostname: 'https://codingfeline.com/',
    })

    const writeStream = createWriteStream(
      resolve(siteConfig.outDir, 'sitemap.xml'),
    )

    sitemap.pipe(writeStream)

    for (const link of this.links) {
      try {
        sitemap.write(link)
      } catch (e) {
        console.log(link)
        console.log(e)
      }
    }

    sitemap.end()

    await new Promise((resolve) => {
      writeStream.on('finish', () => resolve(null))
    })
  }
}
