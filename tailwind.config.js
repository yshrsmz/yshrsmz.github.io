import tailwindTypography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./.vitepress/theme/**/*.{html,js,ts,vue}'],
  theme: {
    extend: {
      colors: {
        amazon: '#f6ce50',
      },
    },
  },
  plugins: [tailwindTypography()],
}
