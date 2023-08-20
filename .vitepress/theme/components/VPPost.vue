<script setup lang="ts">
import { useData } from 'vitepress'
import '../styles/vp-post.css'

const { page, frontmatter } = useData()
</script>

<template>
  <div class="VPPost mt-6 flex flex-col items-center">
    <h1 class="text-center text-2xl font-bold">{{ frontmatter.title }}</h1>
    <time class="mt-4 inline-block" :datetime="page.date.time">{{
      page.date.string
    }}</time>
    <ul class="tags not-prose my-4 flex flex-row gap-2">
      <li
        v-for="(tag, i) in frontmatter.tags"
        :key="`tag_${i}`"
        class="rounded-full border border-gray-600 px-3 text-gray-600 hover:border-gray-400 hover:text-gray-400 dark:border-gray-400 dark:text-gray-400"
      >
        <a :href="`/tags/#${tag}`" class="tag">{{ tag }}</a>
      </li>
    </ul>
    <Content
      class="VPPost__content prose mt-8 max-w-full flex-grow dark:prose-invert hover:prose-a:decoration-dotted"
    />
  </div>
</template>

<style lang="postcss">
@import url('../styles/vp-post.css');

.table-of-contents {
  @apply rounded-md border-2 border-gray-300 bg-gray-50 px-3;
  @apply dark:border-gray-700 dark:bg-gray-900;
}
</style>
