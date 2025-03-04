<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import type { Contributions } from '../types'
import VPPullRequestIcon from './icons/VPPullRequestIcon.vue'
import VPStarIcon from './icons/VPStarIcon.vue'

defineProps<{
  pr: Contributions['prs'][number]
}>()

function formatStars(stars: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(stars)
}
</script>

<template>
  <div class="VPPullRequest flex items-center gap-2 sm:gap-4">
    <a :href="`https://github.com/${pr.repo}`" target="_blank" relative :class="[
      'size-10 sm:size-12 shrink-0 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm',
      pr.type === 'Organization' ? 'rounded-lg' : 'rounded-full'
    ]">
      <img :src="`https://github.com/${pr.repo.split('/')[0]}.png`" :alt="pr.repo" class="size-full">
    </a>

    <div class="flex-1 flex justify-between gap-2 lg:gap-4 min-w-0">
      <div class="flex flex-col min-w-0 gap-0.5 sm:gap-1">
        <a :href="pr.url" target="_blank"
          class="text-sm sm:text-base flex items-center gap-0.5 sm:gap-1 hover:underline text-gray-900 dark:text-white">
          <VPPullRequestIcon :class="{
            'text-green-500 dark:text-green-400': pr.state === 'open',
            'text-gray-500 dark:text-gray-400': pr.state === 'draft',
            'text-purple-500 dark:text-purple-400': pr.state === 'merged',
          }" class="size-4 sm:size-5 shrink-0" />

          <span class="truncate">{{ pr.title }}</span>
        </a>
        <div class="flex gap-2 items-bottom">
          <a :href="`https://github.com/${pr.repo}`" target="_blank"
            class="text-sm sm:text-base inline-flex gap-1 hover:text-black dark:hover:text-white truncate">
            <span class="opacity-75">{{ pr.repo.split('/')[0] }}</span>
            <span class="opacity-50">/</span>
            <span class="truncate">{{ pr.repo.split('/')[1] }}</span>
          </a>
          <a :href="`https://github.com/${pr.repo}`" target="_blank"
            class="items-center hidden sm:inline-flex gap-0.5 hover:text-black dark:hover:text-white truncate">
            <VPStarIcon />
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatStars(pr.stars) }}</span>
          </a>
        </div>
      </div>

      <div class="flex flex-col justify-between shrink-0 text-right">
        <a :href="pr.url" target="_blank" class="hover:underline text-xs sm:text-sm">
          #{{ pr.number }}
        </a>

        <time :prtime="pr.created_at" class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ useTimeAgo(new
          Date(pr.created_at)) }}</time>

      </div>
    </div>
  </div>
</template>
