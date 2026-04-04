import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  root: path.resolve(import.meta.dirname, 'src/renderer'),
  plugins: [react(), tailwindcss()],
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
});
