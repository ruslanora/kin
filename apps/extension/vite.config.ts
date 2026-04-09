import { resolve } from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '',
  resolve: {
    alias: {
      '@kin/ui': resolve(__dirname, '../../libs/ui/src/index.tsx'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: { popup: resolve(__dirname, 'popup.html') },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
});
