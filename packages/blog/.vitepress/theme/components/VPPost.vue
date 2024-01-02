<script setup lang="ts">
import { useData } from 'vitepress'

const { page, frontmatter } = useData()
</script>

<template>
  <div class="VPPost mt-6 flex flex-col items-center">
    <h1 class="text-center text-2xl font-bold">
      {{ frontmatter.title }}
    </h1>
    <time class="mt-4 inline-block" :datetime="page.date?.time">{{
      page.date?.string
    }}</time>
    <ul class="tags not-prose my-4 flex flex-row flex-wrap gap-2">
      <li
        v-for="(tag, i) in frontmatter.tags"
        :key="`tag_${i}`"
        class="rounded-full border border-gray-600 px-3 text-gray-600 hover:border-gray-400 hover:text-gray-400 dark:border-gray-400 dark:text-gray-400"
      >
        <a :href="`/tags/#${tag}`" class="tag">{{ tag }}</a>
      </li>
    </ul>
    <Content
      class="VPPost__content vp-doc prose dark:prose-invert hover:prose-a:decoration-dotted prose-a:break-all mt-8 max-w-full flex-grow"
    />
    <hr class="mt-12 w-2/4" />
  </div>
</template>

<style lang="postcss">
.VPPost {
  .table-of-contents {
    @apply rounded-md border-2 border-gray-300 bg-gray-50 px-3;
    @apply dark:border-gray-700 dark:bg-gray-900;

    a {
      @apply text-gray-600;
      @apply dark:text-gray-400;
    }
  }
}

@media (prefers-color-scheme: dark) {
  .vp-doc {
    --vp-code-link-color: #fff;
    --vp-code-link-hover-color: #fff;
    --vp-code-color: #fff;
    --vp-c-text-2: #fff;
  }
}

@media (prefers-color-scheme: light) {
  .vp-doc {
    --vp-code-link-color: rgb(3, 7, 18);
    --vp-code-link-hover-color: rgb(3, 7, 18);
    --vp-code-color: rgb(3, 7, 18);
  }
}
</style>
