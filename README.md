# imgstry studio

Lightroom in the browser, powered by [imgstry](https://github.com/visual-cortex/imgstry).

Svelte 5 + Vite client around the imgstry engine: non-destructive adjustments
(exposure, contrast, gamma, saturation, vibrance, hue, sepia, sharpen, blur,
noise, black & white, invert), live RGB histogram, hold-to-compare with the
original, and PNG/JPEG export. Rendering runs off the main thread through the
imgstry worker pipeline.

## Development

The engine is consumed straight from the sibling `../imgstry` checkout via a
Vite alias, so clone both repositories next to each other.

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` - dev server
- `npm run build` - production build
- `npm run check` - svelte-check
- `node scripts/smoke.mjs` - Playwright smoke test against a dev server on port 5199
