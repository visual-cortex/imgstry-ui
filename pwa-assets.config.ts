import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config';

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: {
    ...minimal2023Preset,
    transparent: {
      ...minimal2023Preset.transparent,
      sizes: [192, 512],
    },
    maskable: {
      ...minimal2023Preset.maskable,
      sizes: [512],
      resizeOptions: { background: '#131316', fit: 'contain' },
    },
    apple: {
      ...minimal2023Preset.apple,
      sizes: [180],
      resizeOptions: { background: '#131316', fit: 'contain' },
    },
  },
  images: ['public/favicon.svg'],
});
