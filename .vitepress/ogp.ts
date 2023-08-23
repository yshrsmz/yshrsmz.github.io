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
    ['meta', { name: 'og:url', content: url }],
    ['meta', { name: 'og:title', content: title }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:site', content: '@_yshrsmz' }],
  ]

  if (type) {
    results.push(['meta', { name: 'og:type', content: type }])
  }

  if (description) {
    results.push(['meta', { name: 'og:description', content: description }])
  }

  if (siteName) {
    results.push(['meta', { name: 'og:site_name', content: siteName }])
  }

  if (image) {
    results.push(['meta', { name: 'og:image', content: image }])
  }

  return results
}
