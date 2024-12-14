<script setup lang="ts">
import { computed } from 'vue'
import { data } from '../contributions.data.js'
import VPPullRequest from './VPPullRequest.vue';

const datetime = computed(() => {
  const date = new Date(data.updated_at);
  return date.toISOString();
})

const updatedAt = computed(() => {
  const date = new Date(data.updated_at);
  return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
})
</script>

<template>
  <div class="VPContributions mt-6 flex flex-col pb-10">
    <div class="flex flex-col items-center gap-2">
      <a :href="`https://github.com/${data.user.username}`">
        <img class="rounded-full h-14 w-14 text-xl" :src="data.user.avatar" :alt="data.user.username">
      </a>
      <h1 class="text-3xl font-bold text-center">RECENT CONTRIBUTIONS</h1>
      <p class="text-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
        <a :href="`https://github.com/${data.user.username}`" rel="noopener noreferrer" target="_blank">
          @{{ data.user.username }}'s recent pull requests on GitHub.
        </a>
      </p>
      <p class=" text-sm text-gray-500 dark:text-gray-400">Last update: <time :datetime="datetime">{{ updatedAt }}</time></p>
      <div class="flex items-center align-center text-center flex-row mt-2 sm:mt-6 mb-6 sm:mb-10 w-1/2 mx-auto animate-pulse">
        <div class="flex border-gray-200 dark:border-gray-800 w-full border-t border-solid"></div>
      </div>
    </div>
    <ul class="flex flex-col gap-6 sm:gap-6">
      <li v-for="(pr) in data.prs" :key="pr.url">
        <VPPullRequest :pr="pr" />
      </li>
    </ul>
  </div>
</template>
