import { readFileSync } from 'node:fs'
import { format, parseISO } from 'date-fns'
import { type SiteConfig, createMarkdownRenderer } from 'vitepress'
import type { Scrap } from './types'

declare global {
  var VITEPRESS_CONFIG: SiteConfig
}

declare const data: Scrap[]
export { data }

function formatDate(date?: string): string | undefined {
  if (!date) return undefined
  return format(parseISO(date), 'MMMM d, yyyy kk:mm')
}

export default {
  watch: ['data/scraps/*.json'],
  async load(watchedFiles: string[]) {
    const config: SiteConfig = global.VITEPRESS_CONFIG

    const md = await createMarkdownRenderer(
      config.srcDir,
      config.markdown,
      config.site.base,
      config.logger,
    )

    return watchedFiles
      .map((file) => readFileSync(file, 'utf-8'))
      .map<Scrap>((json) => JSON.parse(json))
      .map((scrap) => {
        return {
          ...scrap,
          body: scrap.body ? md.render(scrap.body) : '',
          comments: scrap.comments.map((comment) => ({
            ...comment,
            createdAt: formatDate(comment.createdAt),
            updatedAt: formatDate(comment.updatedAt),
            body: comment.body ? md.render(comment.body) : '',
          })),
          createdAt: formatDate(scrap.createdAt),
          updatedAt: formatDate(scrap.updatedAt),
          closedAt: formatDate(scrap.closedAt),
        }
      })
      .sort((a, b) => {
        const aDate = a.closedAt ?? a.updatedAt ?? a.createdAt ?? 0
        const bDate = b.closedAt ?? b.updatedAt ?? b.createdAt ?? 0

        return new Date(bDate) > new Date(aDate) ? 1 : -1
      })
  },
}
