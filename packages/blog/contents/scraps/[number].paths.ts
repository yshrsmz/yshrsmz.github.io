import { readFileSync } from 'node:fs'
import glob from 'fast-glob'
import type { Scrap } from '../../.vitepress/theme/types'

export default {
  async paths() {
    const scrapJSONFiles = (await glob('./data/scraps/*.json')).sort()

    return scrapJSONFiles
      .map((file) => readFileSync(file, 'utf-8'))
      .map<Scrap>((json) => JSON.parse(json))
      .map((scrap) => {
        return {
          params: {
            number: scrap.number,
            title: scrap.title,
          },
        }
      })
  },
}
