import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    include: ['.vitepress/theme/components/__tests__/**/*.test.ts'],
    environment: 'happy-dom',
  },
})
