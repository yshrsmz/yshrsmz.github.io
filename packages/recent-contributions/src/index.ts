import fs from 'node:fs/promises'
import { Octokit } from 'octokit'
import { fetchContributions, fetchMe } from './github.js'

async function getRecentPRs() {
  const octokit = new Octokit({ auth: process.env.GH_PUBLIC_PAT })

  const user = await fetchMe(octokit)
  const contributions = await fetchContributions(octokit, user)

  await fs.writeFile(
    '../blog/data/recent-contributions.json',
    JSON.stringify(contributions, null, 2),
    'utf-8',
  )
}

getRecentPRs()
  .then(() => {
    console.log('finished collecting contributions')
  })
  .catch((e) => {
    console.error('error while collecting contributions', e)
    process.exit(1)
  })
