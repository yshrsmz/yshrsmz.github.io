import { getInput, setFailed } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { getIssues } from './data/github'

async function run(): Promise<void> {
  console.log('@codingfeline/action-create-scrap start')
  const repo = context.repo

  try {
    const token = getInput('github_token', { required: true })
    const issueNumber = Number(getInput('issue_number', { required: true }))

    const octokit = getOctokit(token)

    await getIssues(repo, issueNumber, octokit)
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message)
    } else {
      setFailed(`Unknown error: ${error}`)
    }
  }
}

run()
