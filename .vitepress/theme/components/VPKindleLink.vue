<script setup lang="ts">
import VPAmazonIcon from '../components/icons/VPAmazonIcon.vue'

defineProps<{ url: string }>()
</script>

<template>
  <a
    :href="url"
    class="bg-amazon inline-block px-4 py-1 text-center font-semibold text-black decoration-transparent"
    target="_blank"
    rel="noopener noreferrer"
    ><VPAmazonIcon
      alt=""
      class="mr-2 inline h-5 w-5"
    />クリックして今すぐチェック</a
  >
</template>
