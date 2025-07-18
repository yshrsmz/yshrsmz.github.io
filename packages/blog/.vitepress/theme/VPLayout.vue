<script setup lang="ts">
import { useData, useRouter } from 'vitepress'
import { computed } from 'vue'
import VPContributions from './components/VPContributions.vue'
import VPFooter from './components/VPFooter.vue'
import VPHeader from './components/VPHeader.vue'
import VPHome from './components/VPHome.vue'
import VPPost from './components/VPPost.vue'
import VPPosts from './components/VPPosts.vue'
import VPScrap from './components/VPScrap.vue'
import VPScraps from './components/VPScraps.vue'
import VPTags from './components/VPTags.vue'
import NotFound from './NotFound.vue'

const { page, frontmatter } = useData()

const titleTag = computed(() =>
  frontmatter.value.layout === 'home' ? 'h1' : 'h2',
)

const showNavigation = computed<boolean>(
  () => frontmatter.value.navigation ?? true,
)

const shouldShowContents = computed(
  () => frontmatter.value.draft !== true || import.meta.env.DEV,
)

if (typeof window !== 'undefined') {
  const router = useRouter()
  router.onAfterRouteChange = (_to) => {
    window.twttr.widgets.load()
  }
}
</script>

<template>
  <div class="flex min-h-screen w-screen max-w-full flex-col items-center" :class="{ 'py-8': !showNavigation }">
    <VPHeader v-if="showNavigation" :title-tag="titleTag" />

    <div v-if="page.isNotFound || !shouldShowContents" class="flex flex-grow flex-col sm:max-w-3xl">
      <NotFound class="mx-8 flex-grow" />
    </div>
    <div v-else-if="frontmatter.layout === 'home'" class="max-w-3xl flex-grow">
      <VPHome />
    </div>
    <div v-else-if="frontmatter.layout === 'posts'" class="flex-grow sm:max-w-3xl">
      <VPPosts class="mx-8" />
    </div>
    <div v-else-if="frontmatter.layout === 'post'" class="w-full flex-grow sm:max-w-3xl">
      <VPPost class="mx-8" />
    </div>
    <div v-else-if="frontmatter.layout === 'tags'" class="flex-grow sm:max-w-3xl">
      <VPTags class="mx-8" />
    </div>
    <div v-else-if="frontmatter.layout === 'scrap'" class="w-full flex-grow sm:max-w-3xl">
      <VPScrap class="sm:mx-8" />
    </div>
    <div v-else-if="frontmatter.layout === 'scraps'" class="w-full flex-grow sm:max-w-3xl">
      <VPScraps class="mx-8" />
    </div>
    <div v-else-if="frontmatter.layout === 'contributions'" class="w-full flex-grow sm:max-w-3xl">
      <VPContributions class="mx-8" />
    </div>
    <div v-else class="mx-8 flex flex-grow flex-col items-center">
      <h1 class="mt-6 text-3xl font-bold">
        {{ frontmatter.title }}
      </h1>
      <Content class="prose dark:prose-invert sm:max-w-3xl" />
    </div>

    <VPFooter v-if="showNavigation" class="pt-24" />
  </div>
</template>
