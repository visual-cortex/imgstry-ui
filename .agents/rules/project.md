---
trigger: glob
globs: '**'
description: 'Core project overview, structure, architecture, and tooling for imgstry-ui.'
applyTo: '**'
---

# Project Guidelines

## Tech Stack

- Svelte 5 (runes mode) + TypeScript.
- Vite for dev/build/preview.
- `imgstry` as the pixel engine (consumed as a dependency).
- RxJS available for streams when needed (already a dep).
- Playwright in `scripts/` for smoke tests.

## Project Structure

```
src/
  App.svelte                 # top-level layout: rails + viewport
  app.css                    # global styles
  main.ts                    # entry point
  lib/
    components/              # Svelte UI components (rails, viewport, sliders, curve, picker)
    editor/
      editor.svelte.ts       # editor state (runes, single source of truth)
      adjustments.ts         # adjustments shape + defaults + derived params
      color.ts               # color-related helpers
      presets.ts             # named adjustment presets
scripts/                     # smoke runners (playwright)
```

## Architecture Patterns

### One editor state, many views
`editor.svelte.ts` exports a single live state object. Components read it and
call its methods; they don't own duplicate state for the same data.

### Components are presentational
`src/lib/components/*.svelte` render the editor state. They accept props for
local concerns (label, range) and call editor methods for mutations.

### imgstry is the engine, never a peer
The UI describes intent (an `Adjustments` record). `editor.svelte.ts`
translates that into imgstry pipeline calls. Never compute pixels in a
component.

### Debounced rendering
Adjustments mutate state immediately. The actual pipeline run is debounced
(`RENDER_DEBOUNCE_MS`) so dragging a slider stays smooth.

### History as snapshots
History entries are deep-cloned adjustment snapshots. Undo / redo restores
the snapshot, then re-renders.

## Commit Standards

Follow [Conventional Commits](https://www.conventionalcommits.org/).

- Types: `feat`, `fix`, `perf`, `refactor`, `test`, `chore`, `docs`, `build`, `ci`.
- Scope hints at the surface: `feat(viewport):`, `fix(curve):`,
  `chore(deps):`.

## Tooling

- **Dev**: `npm run dev`.
- **Build**: `npm run build`.
- **Preview**: `npm run preview`.
- **Type-check**: `npm run check` (svelte-check + tsc).
- **Lint**: `npm run lint`.
- **Smoke**: `npm run test:run` (playwright-driven via `scripts/`).
