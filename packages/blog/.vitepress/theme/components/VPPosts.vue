<script setup lang="ts">
import { data } from '../posts.data.js'
import type { Post } from '../types'

// group by year
const postsByYear = data.reduce(
  (acc, post) => {
    const year = post.date?.year
    if (!year) {
      return acc
    }

    let yearlyPosts = acc.find((p) => p.year === year)
    if (!yearlyPosts) {
      yearlyPosts = { year, posts: [] }
      acc.push(yearlyPosts)
    }
    yearlyPosts.posts.push(post)
    return acc
  },
  [] as { year: string; posts: Post[] }[],
)

const formatPublishedAt = (post: Post): string => {
  return `${post.date?.month}-${post.date?.day}`
}
</script>

<template>
  <div class="VPPosts mt-6 flex flex-col items-center pb-10">
    <h1 class="text-3xl font-bold">POSTS</h1>
    <ul class="mt-6">
      <li v-for="posts in postsByYear" :key="posts.year" class="py-2">
        <h2 class="text-2xl font-bold">
          {{ posts.year }}
        </h2>
        <ul>
          <li
            v-for="(post, i) in posts.posts"
            :key="`post_${posts.year}_${i}`"
            class="mt-1"
          >
            <a :href="post.url">
              <p class="inline-block">
                <time
                  :class="$style.time"
                  class="text-gray-500 dark:text-gray-400"
                  :datetime="post.date?.time"
                  >{{ formatPublishedAt(post) }}</time
                >
                <span class="underline">{{ post.frontmatter.title }}</span>
              </p>
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" module>
.time::after {
  content: ':';
  margin-right: 0.5rem;
}
</style>
