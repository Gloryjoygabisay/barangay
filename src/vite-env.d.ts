/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEW_RELIC_INGESTION_KEY?: string;
  readonly VITE_NEW_RELIC_LOG_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
