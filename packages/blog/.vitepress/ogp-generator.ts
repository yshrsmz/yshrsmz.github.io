import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import type { Font } from 'satori'
import satori from 'satori'

const size = { width: 1200, height: 630 }
const cwd = process.cwd()

export class OGPImageGenerator {
  private fontData: Font[] = []

  private posts: { title: string; publishedAt: string; path: string }[] = []

  registerPost(
    title: string,
    publishedAt: string,
    outDir: string,
    path: string,
  ) {
    this.posts.push({
      title,
      publishedAt,
      path: resolve(outDir, path.replace('index.md', 'ogp.png')),
    })
  }

  async generate2(title: string, publishedAt: string, outpath: string) {
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            fontSize: '48px',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  padding: '20px 56px',
                },
                children: [
                  {
                    type: 'p',
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        flexGrow: 1,
                        fontWeight: '700',
                        textAlign: 'center',
                      },
                      children: title,
                    },
                  },
                  {
                    type: 'p',
                    props: {
                      style: { fontSize: '42px', fontWeight: '400' },
                      children: publishedAt,
                    },
                  },
                  {
                    type: 'p',
                    props: {
                      style: { fontSize: '40px', fontWeight: '700' },
                      children: 'codingfeline.com',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        width: size.width,
        height: size.height,
        fonts: [...this.fontData],
      },
    )

    const resvg = new Resvg(svg)

    const pngData = resvg.render()
    const pngBuffer = pngData.asPng()

    await writeFile(outpath, pngBuffer)
  }

  async generateAll() {
    if (this.fontData.length === 0) {
      const regular = await readFile(
        resolve(cwd, './contents/public/assets/fonts/NotoSansJP-Regular.ttf'),
      )
      const bold = await readFile(
        resolve(cwd, './contents/public/assets/fonts/NotoSansJP-Bold.ttf'),
      )
      this.fontData.push({
        name: 'NotoSansJP',
        style: 'normal',
        data: regular,
        weight: 400,
      })
      this.fontData.push({
        name: 'NotoSansJP',
        style: 'normal',
        data: bold,
        weight: 700,
      })
    }

    await Promise.all(
      this.posts.map((post) =>
        this.generate2(post.title, post.publishedAt, post.path),
      ),
    )
  }
}
