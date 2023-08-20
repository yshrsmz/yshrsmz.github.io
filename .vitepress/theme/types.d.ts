export interface PostDate {
  time: string
  string: string
  year: string
  month: string
  day: string
}

export interface Post {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  frontmatter: Record<string, any>
  title: string
  url: string
  date: PostDate
  excerpt: string | undefined
}

export interface KindleDetail {
  title: string
  asin: string
  authors: string
  publisher: string
  publishedAt: string
  seriesAsin?: string
}
