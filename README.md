<div align="center">
  <img src="public/favicon.svg" width="80" height="80" alt="imgstry studio">

  <h1>imgstry studio</h1>

  <p><strong>Lightroom in the browser. Free. Offline. No login. No nag.</strong></p>

  <p>
    <a href="https://visual-cortex.github.io/imgstry-ui/"><img alt="Try it" src="https://img.shields.io/badge/try%20it-live-6aa8ff?style=for-the-badge"></a>
    <a href="https://github.com/visual-cortex/imgstry"><img alt="Engine" src="https://img.shields.io/badge/engine-imgstry-a25dd0?style=for-the-badge"></a>
    <a href="https://github.com/visual-cortex/imgstry-ui/actions"><img alt="CI" src="https://github.com/visual-cortex/imgstry-ui/actions/workflows/main.yml/badge.svg"></a>
    <img alt="License" src="https://img.shields.io/github/license/visual-cortex/imgstry-ui?style=flat-square">
  </p>

  <sub>Svelte 5 · Vite · imgstry · bits-ui · works on a plane</sub>
</div>

---

## Why this exists

You took 600 shots on vacation. You're on a 9-hour flight back. Your laptop has
2% battery anxiety, no Wi‑Fi, and your subscription editor wants to phone home
before it'll let you push a slider.

`imgstry studio` is a single-page web app you install once (PWA) and then run
forever, offline, with zero accounts, zero telemetry, zero cloud round-trips.
Drop a photo in, drag sliders, export. Pixels never leave your device.

## Features

**Develop module** - Snapseed-style adjust strip on mobile, Lightroom-style
panels on desktop. Same engine on both.

- **Light** - exposure (stops), contrast, highlights, shadows, whites, blacks
- **Color** - temperature, tint, vibrance, saturation, hue
- **Presence** - texture, clarity (luminance unsharp), sharpen, denoise
- **Tone Curve** - drag-and-drop spline, per-channel (RGB / R / G / B)
- **Color Grading** - split tone with shadow + highlight tint
- **Effects** - radial vignette, film grain
- **Creative** - sepia, B&W, invert, color overlay (RGB / HSV / HEX / CMYK pickers)
- **Presets** - 11 curated looks across Cinematic / Vintage / Modern / B&W
- **History** - snapshot timeline with one-tap restore + dedupe

**Editor mechanics**

- Hold to compare with original (`\\` keyboard shortcut)
- Pinch / wheel zoom + drag pan with a floating zoom badge
- Live RGB histogram (real-time, computed by the engine cache)
- Dark + light theme, persisted to localStorage
- PNG / JPEG export with one tap

**Formats**

- Standard: JPG, PNG, WEBP, AVIF, GIF, BMP
- Camera RAW, full sensor pipeline: TIFF / DNG with uncompressed or
  lossless-JPEG (Compression=7) Bayer strips. Decodes 14/16-bit linear,
  demosaics RGGB, applies AsShotNeutral white balance, and tonemaps to
  8-bit sRGB. Exposure adjustments rebake from the linear source so you
  get full headroom for highlight pulls.
- Camera RAW, preview fallback: when sensor decode isn't supported
  (CR3 / HEIF wrap, exotic compression, non-RGGB pattern), the editor
  lifts the embedded JPEG preview baked by the camera.
- Recognised RAW extensions: CR2, CR3, NEF, NRW, ARW, SR2, DNG, ORF,
  RW2, PEF, RAF, X3F, 3FR, CRW, MRW, DCR, KDC, MEF, MOS, ERF.

**Plane mode**

- Installable PWA: home-screen icon, standalone window, no browser chrome
- Workbox precache (~300 KiB) - first load locks the shell, subsequent loads
  work fully offline
- Offline toast tells the user what's going on
- Service worker self-updates with an inline "Reload" prompt

## Try it

→ **<https://visual-cortex.github.io/imgstry-ui/>**

On mobile, hit the share sheet → *Add to Home Screen* once and it'll behave
like a native app from then on.

## Architecture

```
src/
  App.svelte                 # studio shell, responsive layout
  app.css                    # token consumer + utility classes
  main.ts                    # entry; boots theme + PWA singletons
  lib/
    components/              # Svelte UI surface
    editor/
      editor.svelte.ts       # single source of truth, drives imgstry
      adjustments.ts         # typed adjustment shape + defaults
      color.ts               # color-space conversion helpers
      presets.ts             # named looks + group hues
      mobile.svelte.ts       # mobile pane / active adjustment state
      theme.svelte.ts        # dark/light + persistence
      pwa.svelte.ts          # SW lifecycle + online + install state
  styles/
    palette/                 # color ramps (shade + blue/purple/orange/...)
    numeric-increments/      # --ni-N spacing tokens
    sizing/                  # radius + border + space semantics
    typography/              # font scale + weights + tracking
    transitions/             # durations + easings
    layers/                  # z-index slots
    theme/                   # global tokens + dark.css + light.css
public/
  favicon.svg                # source mark
  pwa-*.png                  # generated app icons
scripts/
  smoke-*.mjs                # Playwright behavior probes
```

The UI is presentational. Components describe intent on `editor.adjustments`;
the editor object translates intent into [imgstry](https://github.com/visual-cortex/imgstry)
pipeline operations on a debounced render tick.

## Getting started (development)

The UI consumes the engine straight from a sibling checkout via a Vite alias.
Clone both repos next to each other:

```sh
git clone https://github.com/visual-cortex/imgstry.git
git clone https://github.com/visual-cortex/imgstry-ui.git

cd imgstry      && npm install
cd ../imgstry-ui && npm install

npm run dev     # http://localhost:5173
```

You'll need:

- Node `>= 22`
- npm `>= 10`
- A Chromium-based browser for smoke tests

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Type + Svelte check |
| `npm run lint` | svelte-check in lint mode |
| `npm run pwa:icons` | Regenerate PWA icons from `public/favicon.svg` |
| `node scripts/smoke-develop.mjs` | Desktop develop module flow |
| `node scripts/smoke-mobile.mjs` | iPhone 14 Pro viewport flow |
| `node scripts/smoke-color.mjs` | Color picker mode-switch flow |
| `node scripts/smoke-raw.mjs` | RAW (.nef) embedded-JPEG fallback flow |
| `node scripts/smoke-raw-full.mjs` | Synthetic DNG sensor decode + exposure rebake |

Smoke tests assume a dev server on `:5199`. Launch one with:

```sh
npx vite --port 5199 --strictPort
```

## Contributing

Pull requests are welcome - small, surgical, focused. The vibe is "ship a
thing that delights".

### Workflow

1. Fork → branch → commit → push → PR. Branch from `master`.
2. Run `npm run check` and the smoke scripts before pushing.
3. Use [Conventional Commits](https://www.conventionalcommits.org/) for the
   subject line: `feat(viewport): …`, `fix(curve): …`, `chore(deps): …`.
   Breaking changes use the `!` marker.
4. Squash trivial fixups before review.

### Style

Conventions live in [`.agents/rules/`](.agents/rules/) - they're the single
source of truth (the code agents read them, humans should too):

- `project.md` - tech stack, structure, commit standards.
- `code-principles.md` - pure functions, immutability, type safety, etc.
- `implementation.md` - naming, Svelte 5 specifics, engine boundary.
- `testing.md` - smoke philosophy.
- `components.md` / `editor.md` - domain rules per subsystem.

Highlights:

- Svelte 5 runes (`$state`, `$derived`, `$effect`). No `export let`, no
  legacy stores.
- TypeScript strict, no `any`, narrow at boundaries.
- The UI never imports pixel-level helpers from the engine - call the public
  surface (`Imgstry`, `CubicSpline`, `GaussianBlur`, …).
- Components are presentational. Mutations live on `editor.svelte.ts`.
- Reach for an existing token (`--color-bg`, `--space-md`, `--ni-12`) before
  introducing a bespoke value.

### Adding a feature

Most adjustments follow the same shape:

1. Add the typed key to `Adjustments` (`src/lib/editor/adjustments.ts`) +
   a default value.
2. Wire it in the render queue inside `_queueOperations` of
   `editor.svelte.ts` so the engine consumes it.
3. Drop an `<AdjustmentSlider>` in the right Panel of `RightRail.svelte`
   plus a `MobileSliderSpec` entry in `mobile.svelte.ts` if it should
   surface on mobile.
4. Update or add a smoke script if the user-facing behaviour is novel.

### Adding a preset

Append to `PRESETS` in `src/lib/editor/presets.ts`. The chosen `group`
controls the swatch color via `GROUP_HUE`. Both the desktop rail and the
mobile Tools sheet read from the same array, so a single entry shows up
in both places.

### Reporting issues

Found a bug? Open one. Include the browser + OS, the steps, and a
screenshot. If you have a stack trace from the dev tools, even better.

## License

[MIT](LICENSE) - go wild. If you ship something built on top, a backlink
in your About page is appreciated but not required.

- *vlad & friends, somewhere over the Atlantic*
