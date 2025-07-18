<script setup lang="ts">
import { data } from '../scraps.data.js'
import type { Scrap } from '../types'
import VPScrapLabel from './VPScrapLabel.vue'

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
  <div class="VPScraps mt-6 flex flex-col items-center pb-10">
    <h1 class="text-3xl font-bold">SCRAPS</h1>
    <ul class="mt-6">
      <li v-for="(scrap, i) in data" :key="`scrap_${i}`" class="py-2">
        <a :href="`/scraps/${scrap.number}/`" class="block">
          <div>
            <span class="px-1 underline">{{ scrap.title }}</span>
            <p class="block mt-0.5">
              <VPScrapLabel :state="scrap.state" />
              <time>{{ updatedAt(scrap) }}</time>
            </p>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>
