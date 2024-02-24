/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FETCH_URL: string
  readonly VITE_FETCH_PATH: string
  readonly VITE_FETCH_FULL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
