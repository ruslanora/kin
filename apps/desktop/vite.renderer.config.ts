import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const desktopRoot = import.meta.dirname;

// https://vitejs.dev/config
export default defineConfig(({ command }) => ({
  root: command === 'serve' ? desktopRoot : undefined,
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: path.resolve(desktopRoot, 'index.html'),
    },
  },
  resolve: {
    dedupe: [
      'react',
      'react-dom',
      '@tiptap/react',
      '@tiptap/core',
      '@tiptap/pm',
    ],
    alias: {
      '@kin/ui': path.resolve(import.meta.dirname, '../../libs/ui/src'),
    },
  },
}));
