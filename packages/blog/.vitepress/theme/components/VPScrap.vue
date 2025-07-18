<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { data as scraps } from '../scraps.data.js'
import VPCheckIcon from './icons/VPCheckIcon.vue'
import VPEditIcon from './icons/VPEditIcon.vue'
import VPScrapLabel from './VPScrapLabel.vue'
import VPTagLabel from './VPTagLabel.vue'

const { page } = useData()

// biome-ignore lint/style/noNonNullAssertion: it should exist
const scrapNumber = computed(() => page.value.params!.number)

const scrap = computed(
  // biome-ignore lint/style/noNonNullAssertion: should found
  () => scraps.find((s) => s.number === scrapNumber.value)!,
)

const updatedAt = computed(() => {
  if (scrap.value.closedAt) {
    return `完了日: ${scrap.value.closedAt}`
  }
  if (scrap.value.updatedAt) {
    return `更新日: ${scrap.value.updatedAt}`
  }
  return `完了日: ${scrap.value.createdAt}`
})

const bodies = computed(() => [scrap.value, ...scrap.value.comments])
</script>

<template>
  <div class="VPScrap mt-6 flex flex-col items-center">
    <div class="flex flex-col items-center">
      <div>
        <VPScrapLabel :state="scrap.state" />
        <time class="text-gray-600 dark:text-gray-400">{{ updatedAt }}</time>
      </div>
      <h1 class="mt-2 text-center text-2xl font-bold">
        {{ scrap.title }}
      </h1>
      <ul class="tags not-prose my-4 flex flex-row flex-wrap gap-2">
        <li v-for="(tag, i) in scrap.tags" :key="`tag_${i}`">
          <VPTagLabel :name="tag" :link="`/tags/#${tag}`" />
        </li>
      </ul>
    </div>
    <ul class="w-full">
      <li
        v-for="(item, i) in bodies"
        :key="`item_${i}`"
        class="mt-3 border-b border-t border-gray-300 bg-gray-50 sm:rounded-md sm:border dark:border-gray-400 dark:bg-gray-900"
      >
        <article :id="item.id" class="relative mx-8 my-3 flex flex-col">
          <div
            class="VPPost__content vp-doc prose dark:prose-invert prose-a:hover:decoration-dotted prose-a:break-all mt-4 max-w-full flex-grow"
            v-html="item.body"
          />
          <a
            :href="`#${item.id}`"
            class="inline-block self-end text-sm text-gray-500 dark:text-gray-400"
          >
            <time>{{ item.createdAt }}</time>
          </a>
        </article>
      </li>
    </ul>

    <div
      v-if="scrap.state === 'closed'"
      class="mx-4 mt-6 flex flex-col items-center py-2 text-gray-600 dark:text-gray-400"
    >
      <VPCheckIcon class="inline-block h-12 w-12 text-current" />
      <p class="mt-4 text-center">
        このスクラップは<time class="mx-1">{{ scrap.closedAt }}</time
        >に完了しました
      </p>
    </div>

    <div class="flex w-full justify-end py-3 text-gray-600 dark:text-white">
      <a
        :href="scrap.originUrl"
        target="_blank"
        class="inline-flex items-center font-medium underline"
        ><VPEditIcon class="inline-block" /><span class="mx-2">編集する</span></a
      >
    </div>
  </div>
</template>

<style lang="postcss">
.VPScrap {
  .vp-doc {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      border-top: none;
      padding-top: 0;
      margin-top: 0;

      .header-anchor {
        top: 0;
      }
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
