/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

import type { Api } from '../preload';

declare module '*.css' {
  const content: string;
  export default content;
}

declare global {
  interface Window {
    api: Api;
  }
}
