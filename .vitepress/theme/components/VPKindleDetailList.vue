<script setup lang="ts">
import { computed } from 'vue'
import {
  createProductUrl,
  createProductsUrl,
  createImageUrl,
} from '../composables/useAmazonLink'
import VPKindleLink from './VPKindleLink.vue'
import type { KindleDetail } from '../types'

const props = defineProps<{
  details: KindleDetail[]
}>()

const seriesUrl = computed(() => {
  const asin = props.details.find((d) => !!d.asin)?.seriesAsin
  if (asin) {
    return createProductsUrl(asin)
  }
  return undefined
})
const publisher = computed(() => {
  return props.details.find((d) => !!d.publisher)?.publisher
})
const authors = computed(() => {
  return props.details.find((d) => !!d.authors)?.authors
})
</script>

<template>
  <div class="VPKindleDetailList">
    <ul class="books !my-3 flex !list-none flex-row flex-wrap gap-1 !px-3">
      <li
        v-for="(detail, i) in details"
        :key="`image_${i}`"
        class="!mx-0 !my-0 !p-0"
      >
        <a
          :href="createProductUrl(detail.asin)"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            class="!my-0"
            :src="createImageUrl(detail.asin)"
            :alt="detail.title"
            :title="detail.title"
          />
        </a>
      </li>
    </ul>
    <dl class="flex flex-row flex-wrap gap-1 px-3">
      <dt class="font-semibold">著者:</dt>
      <dd>{{ authors }}</dd>
      <dt class="font-semibold">出版社:</dt>
      <dd>{{ publisher }}</dd>
    </dl>
    <div v-if="seriesUrl" class="mx-3 mt-2">
      <VPKindleLink :url="seriesUrl" />
    </div>
  </div>
</template>

<style lang="postcss" module>
.details {
  display: grid;

  dt {
    grid-column: 1;
    margin-right: 0.5rem;
  }

  .title + dd {
    grid-column: 1 / 3;
  }

  dd {
    grid-column: 2;
  }
}
</style>
