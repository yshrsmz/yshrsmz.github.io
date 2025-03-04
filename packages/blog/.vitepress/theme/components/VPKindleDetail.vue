<script setup lang="ts">
import { computed } from 'vue'
import { useAmazonLink } from '../composables/useAmazonLink'
import type { KindleDetail } from '../types'
import VPAmazonLink from './VPAmazonLink.vue'

const props = withDefaults(
  defineProps<{
    titleLevel?: number
    detail: KindleDetail
    showTitle?: boolean
  }>(),
  { titleLevel: 3, showTitle: false },
)

defineSlots<{
  default: undefined
}>()

const titleTag = `h${props.titleLevel}` as const

const publisher = computed(() => props.detail.publisher ?? '-')

const { productUrl, imageUrl } = useAmazonLink(props.detail.asin)
</script>

<template>
  <div
    class="VPKindleDetail not-prose flex flex-row items-center object-contain decoration-transparent"
  >
    <a :href="productUrl" target="_blank" rel="noopener noreferrer">
      <img
        class="!my-3 px-3"
        style="min-width: 100px; min-height: 125px; max-height: 160px; object-fit: contain;"
        :src="detail.imageUrl ?? imageUrl"
        :alt="detail.title"
        :title="detail.title"
      />
    </a>
    <div>
      <dl :class="$style.details" class="text-sm sm:text-base">
        <template v-if="detail.title && showTitle">
          <dt class="sr-only" :class="$style.title">タイトル</dt>
          <dd class="text-lg font-semibold sm:text-xl">
            <component :is="titleTag" class="!mt-0">
              {{ detail.title }}
            </component>
          </dd>
        </template>
        <dt class="font-semibold">著者:</dt>
        <dd>{{ detail.authors }}</dd>
        <dt class="font-semibold">出版社:</dt>
        <dd>{{ publisher }}</dd>
        <template v-if="detail.publishedAt">
          <dt class="font-semibold">発売日:</dt>
          <dd>{{ detail.publishedAt }}</dd>
        </template>
      </dl>
      <VPAmazonLink :url="productUrl" class="mt-3" />
    </div>
    <div v-if="$slots.default" class="note">
      <slot />
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
