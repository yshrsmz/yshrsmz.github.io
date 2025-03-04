import { getInput, info, setFailed, setOutput } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { getIssues } from './data/github'
import { convertToScrap } from './data/scrap'

async function run(): Promise<void> {
  const repo = context.repo

  try {
    const token = getInput('github_token', { required: true })
    const issueNumber = Number(getInput('issue_number', { required: true }))
    const excludeLabels = getInput('exclude_labels')
      .split(',')
      .map((v) => v.trim())

    const octokit = getOctokit(token)

    const issue = await getIssues(repo, issueNumber, octokit)

    const hasExcludedLabels = issue.issue.labels.some((l) => {
      const label = typeof l === 'string' ? l : l.name
      return excludeLabels.includes(label ?? '')
    })

    if (hasExcludedLabels) {
      info('Issue has excluded labels. Skip creating scrap.')
      return
    }

    const scrap = convertToScrap(issue.issue, issue.comments)

    console.log({ scrap })

    setOutput('scrap', scrap)
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message)
    } else {
      setFailed(`Unknown error: ${error}`)
    }
  }
}

run()
