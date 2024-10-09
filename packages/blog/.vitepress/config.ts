import type { HeadConfig } from 'vitepress'
import { defineConfig } from 'vitepress'
import {
  getPublishedDateFromGitHubDatetime,
  getPublishedDateFromPath,
  getPublishedDateFromRewrittenUrl,
} from './theme/helper'
import type { EntryDate, Scrap } from './theme/types'
import { generateRssFeed } from './rss-generator'
import { generateOGPMeta } from './ogp'
import { OGPImageGenerator } from './ogp-generator'
import { readFileSync } from 'node:fs'

const TITLE = 'CodingFeline'
const DESCRIPTION = 'Thoughts, stories and ideas'
const HOST_NAME = 'https://www.codingfeline.com/'

const ogpGenerator = new OGPImageGenerator()

const isProduction = process.env.NODE_ENV === 'production'
const shouldUseGTM = isProduction
const shouldUseAdsense = isProduction
const productionHeads = new Set<HeadConfig>()
if (shouldUseGTM) {
  productionHeads.add([
    'script',
    {
      async: '',
      src: 'https://www.googletagmanager.com/gtag/js?id=G-XZRK8ZP8XC',
    },
  ])
  productionHeads.add([
    'script',
    { id: 'init-gtm' },
    `window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XZRK8ZP8XC');`,
  ])
}
if (shouldUseAdsense) {
  productionHeads.add([
    'script',
    {
      async: '',
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1022395241918455',
      crossorigin: 'anonymous',
    },
  ])
}

function detectPageTypeFromPath(path: string): 'post' | 'scrap' | 'other' {
  if (path.match(/^scraps\/(\d+)\//)) {
    return 'scrap'
  }
  if (path.match(/^\d{4}\/\d{2}\/\d{2}\/.*\//)) {
    return 'post'
  }
  return 'other'
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: TITLE,
  description: DESCRIPTION,
  lang: 'ja-JP',
  srcDir: 'contents',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
    // https://zenn.dev/catnose99/articles/329d7d61968efb
    // https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
    [
      'script',
      { id: 'register-twitter-widget' },
      `window.twttr = (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function(f) {
          t._e.push(f);
        };

        return t;
      })(document, 'script', 'twitter-wjs');`,
    ],
    ...generateOGPMeta({
      url: HOST_NAME,
      type: 'blog',
      title: TITLE,
      description: DESCRIPTION,
      siteName: TITLE,
      image: `${HOST_NAME}ogp.jpg`,
    }),
    ...productionHeads,
  ],
  appearance: false,
  themeConfig: {},
  markdown: {
    toc: {},
  },
  sitemap: {
    hostname: HOST_NAME,
    transformItems(items) {
      return items.map((item) => {
        const type = detectPageTypeFromPath(item.url)
        let lastmod: string | undefined = undefined
        if (type === 'post') {
          lastmod = getPublishedDateFromRewrittenUrl(item.url)
        } else if (type === 'scrap') {
          const number = item.url.match(/^scraps\/(\d+)\//)?.[1]
          const json: Scrap = JSON.parse(
            readFileSync(`data/scraps/${number}.json`, 'utf-8'),
          )
          lastmod = json.closedAt ?? json.updatedAt ?? json.createdAt
        }
        return {
          ...item,
          lastmod,
        }
      })
    },
  },
  rewrites: {
    'posts/:skipped/:year-:month-:day-:slug(.*).md': ':year/:month/:day/:slug/index.md',
    'scraps/index.md': 'scraps/index.md',
    'scraps/:number.md': 'scraps/:number/index.md',
  },
  async transformPageData(pageData, ctx) {
    let needsOGPImage = false
    if (pageData.frontmatter.layout === 'post') {
      const date = getPublishedDateFromPath(pageData.filePath)
      if (date) {
        needsOGPImage = true
        pageData.date = date
      }
    } else if (pageData.frontmatter.layout === 'scrap') {
      pageData.title = pageData.params!.title
      const date = getPublishedDateFromGitHubDatetime(pageData.params!.lastmod)
      if (date) {
        needsOGPImage = true
        pageData.date = date
      }
    }
    const canonicalUrl = `${HOST_NAME}${pageData.relativePath.replace('index.md', '')}`
    pageData.frontmatter = {
      ...pageData.frontmatter,
      head: [
        ...(pageData.frontmatter.head ?? []),
        ['link', { rel: 'canonical', href: canonicalUrl }],
        ...generateOGPMeta({
          url: `${HOST_NAME}${pageData.relativePath.replace('index.md', '')}`,
          title: pageData.title,
          image: needsOGPImage
            ? `${HOST_NAME}${pageData.relativePath.replace('index.md', 'ogp.png')}`
            : undefined,
        }),
      ],
    }
    if (needsOGPImage) {
      ogpGenerator.registerPost(
        pageData.title,
        pageData.date.string,
        ctx.siteConfig.outDir,
        pageData.relativePath,
      )
    }
  },
  async buildEnd(siteConfig) {
    await generateRssFeed(siteConfig, HOST_NAME, TITLE, DESCRIPTION)
    await ogpGenerator.generateAll()
  },
})

declare module 'vitepress' {
  interface PageData {
    date: EntryDate
  }
}
