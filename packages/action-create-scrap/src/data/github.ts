import type { getOctokit } from '@actions/github'

export type Repo = {
  owner: string
  repo: string
}

export async function getIssues(
  repo: Repo,
  issueNumber: number,
  octokit: ReturnType<typeof getOctokit>,
) {
  const { data, status } = await octokit.rest.issues.get({
    ...repo,
    issue_number: issueNumber,
  })

  console.log({ status, data })

  if (status !== 200) {
    throw new Error(`Failed to get issue #${issueNumber}: ${status}`)
  }

  const res = await octokit.paginate(
    octokit.rest.issues.listComments,
    {
      ...repo,
      issue_number: issueNumber,
      per_page: 10,
    },
    (response) => response.data,
  )

  // const res = await octokit.rest.issues.listComments({
  //   ...repo,
  //   issue_number: issueNumber,
  //   per_page: 10,
  // })

  console.log({ comments: res })
}
