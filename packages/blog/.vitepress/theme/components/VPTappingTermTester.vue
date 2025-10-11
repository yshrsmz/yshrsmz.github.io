<script setup lang="ts">
import { useData } from 'vitepress'
import { onMounted, onUnmounted, ref } from 'vue'

const { frontmatter } = useData()

// Configuration
const MAX_RECORDS = 5000 // Easily configurable limit

// Types
interface KeyRecord {
  id: number
  key: string
  timestamp: number
  timeDiff: number | null
}

// State
let recordId = 0
const records = ref<KeyRecord[]>([])
const inputElement = ref<HTMLTextAreaElement | null>(null)
const inputText = ref('')

// Handlers
const handleKeyDown = (event: KeyboardEvent) => {
  const now = performance.now()
  const lastRecord = records.value[0]
  const timeDiff = lastRecord ? now - lastRecord.timestamp : null

  // Display "Space" for space key instead of empty character
  const displayKey = event.key === ' ' ? 'Space' : event.key

  const newRecord: KeyRecord = {
    id: recordId++,
    key: displayKey,
    timestamp: now,
    timeDiff,
  }

  // Add to front for descending order (newest first)
  records.value.unshift(newRecord)

  // Auto-limit: remove oldest records if exceeding MAX_RECORDS
  if (records.value.length > MAX_RECORDS) {
    records.value.pop()
  }
}

const clearAll = () => {
  records.value = []
  inputText.value = ''
}

// Lifecycle
onMounted(() => {
  if (inputElement.value) {
    inputElement.value.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  if (inputElement.value) {
    inputElement.value.removeEventListener('keydown', handleKeyDown)
  }
})
</script>

<template>
  <div class="VPTappingTermTester mt-6 flex flex-col pb-10">
    <h1 class="text-center text-2xl font-bold">
      {{ frontmatter.title }}
    </h1>
    <p class="mt-6 text-center text-gray-600 dark:text-gray-400">
      キー入力(modifier 含む)の間隔をミリ秒単位で計測します。<br />Tap-Hold の間隔調整に便利です
    </p>
    <div class="mt-6 flex justify-center">
      <button type="button"
        class="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
        :disabled="records.length === 0 && inputText.length === 0" @click="clearAll">
        Clear All
      </button>
    </div>
    <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- Left Column: Input Area -->
      <div class="flex flex-col">
        <label for="input-area" class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Type here to test
        </label>
        <textarea id="input-area" ref="inputElement" v-model="inputText"
          class="h-[70vh] w-full resize-none overflow-y-auto rounded-md border border-gray-300 p-4 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          placeholder="Start typing to log keystrokes..." />
      </div>

      <!-- Right Column: Key Logger -->
      <div class="flex flex-col">
        <h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Key Log ({{ records.length }}/{{ MAX_RECORDS }})
        </h3>

        <div
          class="h-[70vh] overflow-y-auto rounded-md border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
          <ul v-if="records.length > 0" class="space-y-2 font-mono text-sm">
            <li v-for="record in records" :key="record.id"
              class="flex items-center justify-between border-b border-gray-200 py-2 last:border-b-0 dark:border-gray-700">
              <span class="font-semibold text-gray-900 dark:text-gray-100">
                {{ record.key }}
              </span>
              <span v-if="record.timeDiff !== null" class="text-gray-600 dark:text-gray-400">
                {{ Math.round(record.timeDiff) }}ms
              </span>
            </li>
          </ul>

          <p v-else class="text-center text-sm text-gray-500 dark:text-gray-400">
            No keystrokes logged yet. Start typing in the input area.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
