import { Octokit } from 'octokit'
import { Contributions, PullRequest, User } from './types'

export async function fetchMe(octokit: Octokit): Promise<User> {
  const { data } = await octokit.request('GET /user')
  return {
    name: data.name ?? data.login,
    username: data.login,
    avatar: data.avatar_url,
  }
}

const REPO_CACHE = new Map<string, any>()

export async function fetchRepo(octokit: Octokit, owner: string, name: string) {
  const key = `${owner}/${name}`

  if (REPO_CACHE.has(key)) {
    return REPO_CACHE.get(key)
  }

  const { data } = await octokit.request('GET /repos/{owner}/{name}', {
    owner,
    name,
  })

  REPO_CACHE.set(key, data)

  return data
}

export async function fetchContributions(
  octokit: Octokit,
  user: User,
): Promise<Contributions> {
  const { data } = await octokit.request('GET /search/issues', {
    q: `type:pr+author:${user.username}`,
    per_page: 50,
    page: 1,
  })

  const mergedPrs = data.items.filter(
    (issue) => !(issue.state === 'closed' && !issue.pull_request?.merged_at),
  )

  const prs: PullRequest[] = []
  for (const pr of mergedPrs) {
    const [owner, name] = pr.repository_url.split('/').slice(-2)
    const repo = await fetchRepo(octokit, owner, name)

    prs.push({
      repo: `${owner}/${name}`,
      title: pr.title,
      url: pr.html_url,
      created_at: pr.created_at,
      state: pr.pull_request?.merged_at
        ? 'merged'
        : pr.draft
          ? 'draft'
          : (pr.state as 'open' | 'closed'),
      number: pr.number,
      type: repo.owner.type,
      stars: repo.stargazers_count,
    })
  }

  return { user, prs }
}
