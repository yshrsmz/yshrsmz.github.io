import assert from 'node:assert'
import fs from 'node:fs'
import type { Contributions } from './types'

declare const data: Contributions

export { data }

export default {
  watch: ['data/recent-contributions.json'],
  async load(watchedFiles: string[]) {
    assert(
      watchedFiles.length === 1,
      `expected one file to be watched: ${watchedFiles}`,
    )

    const filePath = watchedFiles[0]
    const file = fs.readFileSync(filePath, 'utf-8')

    return JSON.parse(file)
  },
}
