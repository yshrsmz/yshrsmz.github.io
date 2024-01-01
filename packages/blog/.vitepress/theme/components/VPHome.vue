<script setup lang="ts">
import { data as posts } from '../posts.data.js'
import { data as scraps } from '../scraps.data.js'
import type { Scrap } from '../types'
import VPScrapLabel from './VPScrapLabel.vue'

const recentPosts = posts.slice(0, 10)
const recentScraps = scraps.slice(0, 10)

function updatedAt(scrap: Scrap) {
  if (scrap.closedAt) {
    return scrap.closedAt
  }
  if (scrap.updatedAt) {
    return scrap.updatedAt
  }
  return scrap.createdAt
}
</script>

<template>
  <div class="VPHome mt-6 flex flex-col items-center">
    <h2 class="text-2xl font-bold">RECENT POSTS</h2>
    <ul class="mt-6 w-full">
      <li v-for="(post, index) in recentPosts" :key="index" class="py-3">
        <a :href="post.url" class="block">
          <p class="font-bold underline">{{ post.frontmatter.title }}</p>
          <time
            :datetime="post.date?.time"
            class="text-sm text-gray-500 dark:text-gray-400"
            >{{ post.date?.string }}</time
          >
          <!-- eslint-disable vue/no-v-html -->
          <div class="text-gray-700 dark:text-gray-300" v-html="post.excerpt" />
          <!-- eslint-enable -->
        </a>
      </li>
      <li class="mt-4 text-center">
        <hr />
        <a href="/posts/" class="inline-block py-4 text-center underline"
          >See all posts -></a
        >
      </li>
    </ul>

    <hr class="my-12 w-2/4" />

    <h2 class="mt-6 text-2xl font-bold">RECENT SCRAPS</h2>
    <ul class="mt-6 w-full">
      <li v-for="(scrap, index) in recentScraps" :key="index" class="py-3">
        <a :href="`/scraps/${scrap.number}/`" class="block">
          <p class="px-1 font-bold underline">{{ scrap.title }}</p>
          <p>
            <VPScrapLabel :state="scrap.state" /><time
              :datetime="updatedAt(scrap)"
              class="text-sm text-gray-500 dark:text-gray-400"
              >{{ updatedAt(scrap) }}</time
            >
          </p>
        </a>
      </li>
      <li class="mt-4 text-center">
        <hr />
        <a href="/scraps/" class="inline-block py-4 text-center underline"
          >See all scraps -></a
        >
      </li>
    </ul>
  </div>
</template>
