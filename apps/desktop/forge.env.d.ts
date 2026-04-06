/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

import type { Api } from './src/preload';

declare global {
  interface Window {
    api: Api;
  }
}
