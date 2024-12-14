export interface User {
  username: string
  name: string
  avatar: string
}

export interface PullRequest {
  repo: string
  title: string
  url: string
  created_at: string
  state: 'merged' | 'draft' | 'open' | 'closed'
  number: number
  type: 'User' | 'Organization'
  stars: number
}

export interface Contributions {
  updated_at: number
  user: User
  prs: PullRequest[]
}
