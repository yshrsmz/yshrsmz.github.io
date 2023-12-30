<script setup lang="ts">
const props = defineProps<{ titleTag: string }>()
</script>

<template>
  <header class="VPHeader flex w-full flex-col items-center py-6">
    <div
      class="flex w-full max-w-4xl flex-row items-baseline justify-between px-3"
    >
      <component :is="props.titleTag" class="text-lg font-bold">
        <a href="/">CodingFeline</a>
      </component>
      <nav>
        <ul class="flex flex-row gap-3">
          <li><a href="/about/">About</a></li>
          <li><a href="/products/">Products</a></li>
          <li><a href="/tags/">Tags</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>
