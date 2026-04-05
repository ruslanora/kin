import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), tailwindcss(), dts()],
  resolve: {
    alias: {
      '@kin/ui/utils': path.resolve(import.meta.dirname, 'src/utils/index.ts'),
    },
  },
  build: {
    lib: {
      name: '@kin/ui',
      entry: path.resolve(import.meta.dirname, 'src/index.tsx'),
      format: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@tiptap/extension-placeholder',
        '@tiptap/react',
        '@tiptap/starter-kit',
        'react-icons',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
        },
      },
    },
  },
});
