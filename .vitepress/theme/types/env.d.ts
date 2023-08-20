/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PA_API_KEY: string
  readonly PA_API_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
