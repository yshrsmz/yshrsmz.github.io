import type { EntriesForTag, Entry, Scrap } from './types'
import { readFileSync } from 'node:fs'
import { getPublishedDateFromGitHubDatetime, hasOwnProperty, sortByDate } from './helper'

declare const data: EntriesForTag[]
export { data }

export default {
  watch: ['data/scraps/*.json'],
  async load(watchedFiles: string[]) {
    const scraps = watchedFiles
      .map((file) => readFileSync(file, 'utf-8'))
      .map<Scrap>((json) => JSON.parse(json))
      .map<Entry & { tags: string[] }>((scrap) => {
        const date = scrap.closedAt ?? scrap.updatedAt ?? scrap.createdAt ?? undefined
        return {
          title: scrap.title,
          url: `/scraps/${scrap.number}/`,
          date: getPublishedDateFromGitHubDatetime(date),
          tags: scrap.tags,
        }
      })
      .sort((a, b) => {
        return (a.date ?? 0) > (b.date ?? 0) ? 1 : -1
      })

    const scrapsByTag = scraps.reduce(
      (acc, scrap) => {
        const tags: string[] = scrap.tags
        tags.forEach((tag) => {
          if (!hasOwnProperty(acc, tag)) {
            acc[tag] = []
          }

          acc[tag].push({
            title: scrap.title,
            url: scrap.url,
            date: scrap.date,
          })
        })
        return acc
      },
      {} as Record<string, Entry[]>,
    )

    return Object.entries(scrapsByTag)
      .sort(([tagA], [tagB]) => tagA.localeCompare(tagB))
      .map(([tag, entries]) => {
        return {
          tag,
          entries: entries.sort((a, b) => sortByDate(a, b)),
        }
      })
  },
}
