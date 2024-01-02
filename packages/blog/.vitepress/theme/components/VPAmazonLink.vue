<script setup lang="ts">
import VPAmazonIcon from '../components/icons/VPAmazonIcon.vue'

defineProps<{ url: string }>()
</script>

<template>
  <a
    :href="url"
    class="VPAmazonLink bg-amazon inline-block px-4 py-1 text-center font-semibold !text-black"
    target="_blank"
    rel="noopener noreferrer"
    ><VPAmazonIcon
      alt=""
      class="!hover:decoration-transparent mr-2 inline h-5 w-5"
    />クリックして今すぐチェック</a
  >
</template>

<style lang="postcss">
a.VPAmazonLink {
  text-decoration: none !important;

  &:hover {
    text-decoration: none !important;
  }
}
</style>
