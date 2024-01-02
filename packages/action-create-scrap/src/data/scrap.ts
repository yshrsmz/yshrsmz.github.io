import type { Issue, IssueComment } from './github'

export interface ScrapComment {
  id: string
  body?: string
  createdAt: string
  updatedAt: string
}

export interface Scrap {
  number: number
  id: string
  title: string
  body?: string
  state: 'open' | 'closed'
  tags: string[]
  originUrl: string
  createdAt: string
  updatedAt: string
  closedAt?: string
  comments: ScrapComment[]
}

export function convertToScrap(issue: Issue, comments: IssueComment[]): Scrap {
  return {
    number: issue.number,
    id: issue.node_id,
    title: issue.title,
    body: issue.body ? issue.body : undefined,
    state: issue.state as Scrap['state'],
    tags: issue.labels
      .map((l) => (typeof l === 'string' ? l : l.name))
      .filter((l): l is string => l != undefined),
    originUrl: issue.html_url,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    closedAt: issue.closed_at ? issue.closed_at : undefined,
    comments: comments.map<ScrapComment>((c) => ({
      body: c.body,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      id: c.node_id,
    })),
  }
}
