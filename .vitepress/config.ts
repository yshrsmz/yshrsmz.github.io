import { defineConfig } from 'vitepress'
import {
  getPublishedDateFromPath,
  getPublishedDateFromRewrittenUrl,
} from './theme/helper'
import type { PostDate } from './theme/types'
import { generateRssFeed } from './rss-generator'
import { generateOGPMeta } from './ogp'

const TITLE = 'CodingFeline'
const DESCRIPTION = 'Thoughts, stories and ideas'
const HOST_NAME = 'https://codingfeline.com/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: TITLE,
  description: DESCRIPTION,
  lang: 'ja-JP',
  srcDir: 'contents',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
    [
      'script',
      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-XZRK8ZP8XC',
      },
    ],
    [
      'script',
      { id: 'init-gtm' },
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XZRK8ZP8XC');`,
    ],
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
    // adsense
    [
      'script',
      {
        async: '',
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1022395241918455',
        crossorigin: 'anonymous',
      },
    ],
    ...generateOGPMeta({
      url: HOST_NAME,
      type: 'blog',
      title: TITLE,
      description: DESCRIPTION,
      siteName: TITLE,
      image: `${HOST_NAME}ogp.jpg`,
    }),
  ],
  themeConfig: {},
  markdown: {
    toc: {},
  },
  sitemap: {
    hostname: HOST_NAME,
    transformItems(items) {
      return items.map((item) => {
        return {
          ...item,
          lastmod: getPublishedDateFromRewrittenUrl(item.url),
        }
      })
    },
  },
  rewrites: {
    'posts/:skipped/:year-:month-:day-:slug.md':
      ':year/:month/:day/:slug/index.md',
  },
  transformPageData(pageData, _ctx) {
    if (pageData.frontmatter.layout === 'post') {
      const date = getPublishedDateFromPath(pageData.filePath)
      pageData.date = date
      pageData.frontmatter = {
        ...pageData.frontmatter,
        head: [
          ...(pageData.frontmatter.head ?? []),
          ...generateOGPMeta({
            url: `${HOST_NAME}${pageData.relativePath.replace('index.md', '')}`,
            title: pageData.title,
          }),
        ],
      }
    }
  },
  async buildEnd(siteConfig) {
    await generateRssFeed(siteConfig, HOST_NAME, TITLE, DESCRIPTION)
  },
})

declare module 'vitepress' {
  interface PageData {
    date: PostDate
  }
}
