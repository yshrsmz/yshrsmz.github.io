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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontmatter: Record<string, any>
  title: string
  url: string
  date: EntryDate | undefined
  excerpt: string | undefined
}
