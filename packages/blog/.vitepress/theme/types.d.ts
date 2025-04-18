export interface KindleDetail {
  title: string
  asin: string
  authors: string
  publisher: string
  publishedAt: string
  seriesAsin?: string
  imageUrl?: string
}

export interface ScrapComment {
  id: string
  body?: string
  createdAt: string
  updatedAt: string
}

export interface Scrap {
  id: string
  number: number
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

export interface EntryDate {
  time: string
  string: string
  year: string
  month: string
  day: string
}

export interface Entry {
  title: string
  url: string
  date: EntryDate | undefined
}

export interface EntriesForTag {
  tag: string
  entries: Entry[]
}

export interface Post {
  // biome-ignore lint/suspicious/noExplicitAny: safe to ignore
  frontmatter: Record<string, any>
  title: string
  url: string
  date: EntryDate | undefined
  excerpt: string | undefined
}

// Contributions
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
