import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// GH_PAGES_BASE lets the CI build target the project-scoped pages URL
// (e.g. /imgstry-ui/) while local dev stays rooted at /.
const base = process.env.GH_PAGES_BASE ?? '/';

export default defineConfig({
  base,
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'apple-touch-icon-180x180.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'maskable-icon-512x512.png',
      ],
      manifest: {
        name: 'imgstry studio',
        short_name: 'imgstry',
        description: 'Lightroom in the browser, powered by imgstry. Edit photos offline, on a plane, like a boss.',
        theme_color: '#131316',
        background_color: '#131316',
        display: 'standalone',
        orientation: 'any',
        start_url: `${base}?source=pwa`,
        scope: base,
        categories: ['photo', 'graphics', 'productivity'],
        icons: [
          { src: 'pwa-192x192.png',          sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png',          sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'favicon.svg',              sizes: 'any',     type: 'image/svg+xml', purpose: 'any' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,wasm}'],
        // Bump the limit because the worker bundle pulls the engine in.
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        navigateFallback: `${base}index.html`,
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // user-imported images come through blob: URLs but stay in
            // memory; only outbound HTTP image fetches need caching.
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'imgstry-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
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
