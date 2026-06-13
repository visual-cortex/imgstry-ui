import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      // consume the engine straight from source for full types and HMR
      imgstry: resolve(import.meta.dirname, '../imgstry/source/index.ts'),
      '~': resolve(import.meta.dirname, '../imgstry/source'),
    },
  },
  server: {
    fs: {
      allow: ['.', '../imgstry'],
    },
  },
});
