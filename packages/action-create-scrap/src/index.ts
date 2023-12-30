import { getInput, setFailed, setOutput } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { getIssues } from './data/github'
import { convertToScrap } from './data/scrap'

async function run(): Promise<void> {
  console.log('@codingfeline/action-create-scrap start')
  const repo = context.repo

  try {
    const token = getInput('github_token', { required: true })
    const issueNumber = Number(getInput('issue_number', { required: true }))

    const octokit = getOctokit(token)

    const issue = await getIssues(repo, issueNumber, octokit)
    const scrap = convertToScrap(issue.issue, issue.comments)

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
