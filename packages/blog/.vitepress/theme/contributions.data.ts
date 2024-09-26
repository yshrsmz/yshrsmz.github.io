import type { Contributions } from "./types"
import fs from 'node:fs'
import assert from 'node:assert'

declare const data: Contributions

export { data }

export default {
  watch: ['data/recent-contributions.json'],
  async load(watchedFiles: string[]) {

    assert(watchedFiles.length === 1, `expected one file to be watched: ${watchedFiles}`)

    return watchedFiles
      .map((file) => fs.readFileSync(file, 'utf-8'))
      .map((text) => JSON.parse(text))[0]
  },
}
