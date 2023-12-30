import type { getOctokit } from '@actions/github'
import type { GitHub } from '@actions/github/lib/utils'

export type Repo = {
  owner: string
  repo: string
}

export type Issue = Awaited<
  ReturnType<InstanceType<typeof GitHub>['rest']['issues']['get']>
>['data']

export type IssueComment = Awaited<
  ReturnType<InstanceType<typeof GitHub>['rest']['issues']['listComments']>
>['data'][number]

export async function getIssues(
  repo: Repo,
  issueNumber: number,
  octokit: ReturnType<typeof getOctokit>,
) {
  const { data: issue, status } = await octokit.rest.issues.get({
    ...repo,
    issue_number: issueNumber,
  })

  console.log({ status, issue })

  if (status !== 200) {
    throw new Error(`Failed to get issue #${issueNumber}: ${status}`)
  }

  const comments = await octokit.paginate(
    octokit.rest.issues.listComments,
    {
      ...repo,
      issue_number: issueNumber,
      per_page: 10,
    },
    (response) => response.data,
  )

  console.log({ comments })

  return {
    issue,
    comments,
  }
}
