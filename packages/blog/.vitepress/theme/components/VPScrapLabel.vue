<script setup lang="ts">
defineProps<{ state: 'open' | 'closed' }>()
</script>
<template>
  <span
    class="mr-2 rounded-full px-4 py-1 text-sm"
    :class="{
      'bg-green-600 text-white': state === 'open',
      'bg-violet-600 text-white': state === 'closed',
    }"
    >{{ state.toUpperCase() }}</span
  >
</template>
