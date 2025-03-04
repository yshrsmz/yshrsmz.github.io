import { readFileSync } from 'node:fs'
import {
  getPublishedDateFromGitHubDatetime,
  objectHasOwnProperty,
  sortByDate,
} from './helper'
import type { EntriesForTag, Entry, Scrap } from './types'

declare const data: EntriesForTag[]
export { data }

export default {
  watch: ['data/scraps/*.json'],
  async load(watchedFiles: string[]) {
    const scraps = watchedFiles
      .map((file) => readFileSync(file, 'utf-8'))
      .map<Scrap>((json) => JSON.parse(json))
      .map<Entry & { tags: string[] }>((scrap) => {
        const date =
          scrap.closedAt ?? scrap.updatedAt ?? scrap.createdAt ?? undefined
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

    const scrapsByTag = scraps.reduce<Record<string, Entry[]>>((acc, scrap) => {
      const tags: string[] = scrap.tags
      for (const tag of tags) {
        if (!objectHasOwnProperty(acc, tag)) {
          acc[tag] = [] as Entry[]
        }
        acc[tag].push(scrap)
      }
      return acc
    }, {})

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
