import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// GH_PAGES_BASE lets the CI build target the project-scoped pages URL
// (e.g. /imgstry-ui/) while local dev stays rooted at /.
const base = process.env.GH_PAGES_BASE ?? '/';

export default defineConfig({
  base,
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
