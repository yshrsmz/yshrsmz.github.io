<script setup lang="ts">
import { useAmazonLink } from '../composables/useAmazonLink'
import VPAmazonLink from './VPAmazonLink.vue'

const props = defineProps<{
  detail: { asin: string; title: string; maker: string }
}>()

const { imageUrl, productUrl } = useAmazonLink(props.detail.asin)
</script>

<template>
  <div
    class="VPAmazonGoods my-3 flex flex-col items-center decoration-transparent sm:flex-row not-prose"
  >
    <a :href="productUrl" target="_blank" rel="noopener noreferrer">
      <img
        class="!my-3 min-w-[100px] object-contain px-3"
        style="min-width: 150px; min-height: 125px"
        :src="imageUrl"
        :alt="detail.title"
        :title="detail.title"
      />
    </a>
    <div class="flex flex-col items-center sm:items-start">
      <dl :class="$style.details">
        <dt>商品名:</dt>
        <dd>{{ detail.title }}</dd>
        <dt>メーカー:</dt>
        <dd>{{ detail.maker }}</dd>
      </dl>
      <VPAmazonLink :url="productUrl" class="mt-3" />
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
