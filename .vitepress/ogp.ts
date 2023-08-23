import type { HeadConfig } from 'vitepress'

type OGPOptions = {
  url: string
  type?: string
  title: string
  description?: string
  siteName?: string
  image?: string
}

export function generateOGPMeta({
  url,
  type,
  title,
  description,
  siteName,
  image,
}: OGPOptions): HeadConfig[] {
  const results: HeadConfig[] = [
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'twitter:card', content: 'summary' }],
    ['meta', { property: 'twitter:site', content: '@_yshrsmz' }],
  ]

  if (type) {
    results.push(['meta', { property: 'og:type', content: type }])
  }

  if (description) {
    results.push(['meta', { property: 'og:description', content: description }])
  }

  if (siteName) {
    results.push(['meta', { property: 'og:site_name', content: siteName }])
  }

  if (image) {
    results.push(['meta', { property: 'og:image', content: image }])
  }

  return results
}
