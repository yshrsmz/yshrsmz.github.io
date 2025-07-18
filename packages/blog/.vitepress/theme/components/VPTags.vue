<script setup lang="ts">
import { objectHasOwnProperty, sortByDate } from '../helper.ts'
import { data as tagsForPosts } from '../tags.data.js'
import { data as tagsForScraps } from '../tags-scraps.data.js'
import type { Entry } from '../types.ts'
import VPTagIcon from './icons/VPTagIcon.vue'
import VPTagLabel from './VPTagLabel.vue'

const entriesByTag = [...tagsForPosts, ...tagsForScraps].reduce<
  Record<string, Entry[]>
>((acc, { tag, entries }) => {
  if (!objectHasOwnProperty(acc, tag)) {
    acc[tag] = []
  }
  acc[tag].push(...entries)
  return acc
}, {})

const tagEntries = Object.entries(entriesByTag)
  .sort(([tagA], [tagB]) => tagA.localeCompare(tagB))
  .map(([tag, entries]) => ({
    tag,
    entries: entries.sort((a, b) => sortByDate(a, b)),
  }))
</script>

<template>
  <div class="VPTags mt-6 flex flex-col items-center pb-10">
    <h1 class="text-3xl font-bold">TAGS</h1>

    <ul class="mt-6 flex flex-row flex-wrap gap-1">
      <li>all tags:</li>
      <li v-for="(postsForTag, i) in tagEntries" :key="`tagname_${i}`">
        <VPTagLabel :name="postsForTag.tag" :link="`#${postsForTag.tag}`" />
      </li>
    </ul>

    <section class="mt-6">
      <h2 class="sr-only">posts for each tag</h2>
      <ul>
        <li v-for="(postsForTag, i) in tagEntries" :key="`tag_${i}`" class="my-4">
          <h2 :id="postsForTag.tag" class="align-middle text-xl font-semibold">
            <a :href="`#${postsForTag.tag}`" class="inline-flex flex-row items-center"
              ><VPTagIcon class="mr-1 inline" />{{ postsForTag.tag }}</a
            >
          </h2>
          <ul>
            <li
              v-for="(post, j) in postsForTag.entries"
              :key="`tag_${i}_${j}`"
              class="mt-1"
            >
              <a :href="post.url"
                ><time
                  :class="$style.time"
                  class="text-gray-500 dark:text-gray-400"
                  :datetime="post.date?.time"
                  >{{ post.date?.time }}</time
                ><span class="underline">{{ post.title }}</span></a
              >
            </li>
          </ul>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="postcss" module>
.time::after {
  content: ':';
  margin-right: 0.5rem;
}
</style>
