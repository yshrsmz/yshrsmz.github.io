<script setup lang="ts">
defineProps<{ link: string; name: string }>()
</script>

<template>
  <a
    :href="link"
    class="VPTagLabel rounded-full border border-gray-600 px-3 text-gray-600 hover:border-gray-400 hover:text-gray-400 dark:border-gray-400 dark:text-gray-400"
  >
    {{ name }}
  </a>
</template>
