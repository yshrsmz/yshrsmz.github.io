<script setup lang="ts">
import VPRedditIcon from './icons/VPRedditIcon.vue'
import VPXIcon from './icons/VPXIcon.vue'
import VPGitHubIcon from './icons/VPGitHubIcon.vue'
import VPStackOverflowIcon from './icons/VPStackOverflowIcon.vue'
import VPStackExchangeIcon from './icons/VPStackExchangeIcon.vue'
import VPRssIcon from './icons/VPRssIcon.vue'

const year = new Date().getUTCFullYear()
</script>

<template>
  <footer class="VPFooter flex w-full flex-col items-center py-6">
    <div class="flex max-w-4xl flex-col items-center">
      <div>
        <p class="sr-only">Social links</p>
        <ul class="flex flex-row items-center gap-4">
          <li class="h-8 w-8">
            <a
              href="https://feeds.feedburner.com/codingfeline"
              target="_blank"
              rel="noopener noreferrer"
              ><VPRssIcon class="fill-current dark:text-gray-100"
            /></a>
          </li>
          <li class="h-8 w-8">
            <a
              href="https://github.com/yshrsmz"
              target="_blank"
              rel="noopener noreferrer"
              ><VPGitHubIcon class="fill-current dark:text-gray-100"
            /></a>
          </li>
          <li class="h-8 w-8">
            <a
              href="https://stackexchange.com/users/456702/yshrsmz"
              target="_blank"
              rel="noopener noreferrer"
              ><VPStackExchangeIcon class="fill-current dark:text-gray-100"
            /></a>
          </li>
          <li class="h-8 w-8">
            <a
              href="https://stackoverflow.com/users/855599/yshrsmz"
              target="_blank"
              rel="noopener noreferrer"
              ><VPStackOverflowIcon class="fill-current dark:text-gray-100"
            /></a>
          </li>
          <li class="h-8 w-8">
            <a
              href="https://twitter.com/_yshrsmz"
              target="_blank"
              rel="noopener noreferrer"
              ><VPXIcon class="fill-current dark:text-gray-100"
            /></a>
          </li>
          <li class="h-8 w-8">
            <a
              href="https://reddit.com/user/yshrsmz"
              target="_blank"
              rel="noopener noreferrer"
              ><VPRedditIcon class="fill-current dark:text-gray-100"
            /></a>
          </li>
        </ul>
      </div>
      <p class="mt-4">© 2020 - {{ year }}, yshrsmz</p>
      <a href="/privacy-policy/" class="underline">privacy policy</a>
    </div>
  </footer>
</template>
