import type { Scrap } from './types'
import { readFileSync } from 'node:fs'
import { parseISO, format } from 'date-fns'
import { createMarkdownRenderer, type SiteConfig } from 'vitepress'

declare const data: Scrap[]
export { data }

function formatDate(date?: string): string | undefined {
  if (!date) return undefined
  return format(parseISO(date), 'MMMM d, yyyy kk:mm')
}

export default {
  watch: ['data/scraps/*.json'],
  async load(watchedFiles: string[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: SiteConfig = (global as any).VITEPRESS_CONFIG

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

        return bDate > aDate ? 1 : -1
      })
  },
}
