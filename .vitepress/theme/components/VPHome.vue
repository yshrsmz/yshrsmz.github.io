<script setup lang="ts">
import { data as posts } from '../posts.data.js'

const recentPosts = posts.slice(0, 10)
</script>

<template>
  <div class="VPHome mt-6 flex flex-col items-center">
    <h2 class="text-2xl font-bold">RECENT POSTS</h2>
    <ul class="mt-6">
      <li v-for="(post, index) in recentPosts" :key="index" class="py-3">
        <a :href="post.url" class="block">
          <p class="font-bold underline">{{ post.frontmatter.title }}</p>
          <time
            :datetime="post.date?.time"
            class="text-sm text-gray-500 dark:text-gray-400"
            >{{ post.date?.string }}</time
          >
          <!-- eslint-disable vue/no-v-html -->
          <div
            :class="$style.excerpt"
            class="text-gray-700 dark:text-gray-300"
            v-html="post.excerpt"
          ></div>
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
  </div>
</template>

<style lang="postcss" module>
.excerpt > p::after {
  content: '…';
}
</style>
