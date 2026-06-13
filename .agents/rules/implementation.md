---
trigger: glob
globs: '**'
description: 'General implementation approach for imgstry-ui source code.'
applyTo: '**'
---

# Implementation Guidelines

## Before Writing Code

- Search for an existing pattern. This codebase has conventions.
- Check how similar UI controls or editor methods are implemented before
  adding a new one.
- Prefer linking to a real file as the example, not an abstract description.

## Naming Conventions

- **PascalCase**: Svelte components (`Histogram.svelte`,
  `ToneCurve.svelte`), interfaces, type aliases.
- **camelCase**: functions, variables, methods, non-component file names.
- **ALL_CAPS**: module-level fixed constants (e.g.
  `RENDER_DEBOUNCE_MS`, `DEFAULT_ADJUSTMENTS`). Not for ordinary `const`s.
- Svelte component files end in `.svelte`. State modules that hold runes use
  the `.svelte.ts` suffix (e.g. `editor.svelte.ts`).

## TypeScript Standards

- Strict mode on.
- No `any`. Narrow at boundaries; never propagate.
- Types co-locate with their producer (e.g. `Adjustments` lives next to the
  defaults that match its shape).
- Use `readonly` on shared shapes the consumer must not mutate.

## Svelte 5 Specifics

- Use runes (`$state`, `$derived`, `$effect`). No `export let`, no `$:`, no
  `createEventDispatcher`.
- Snippets (`{#snippet}` + `Snippet` type) for slot-like composition.
- `$effect` is a last resort — prefer pure `$derived` where possible.
- Keep `.svelte.ts` modules as the home for shared reactive state; components
  read from them, they don't re-create state.

## Engine Boundary

- The UI never imports pixel-level helpers from `imgstry` internals. Use the
  public surface (`Imgstry`, `CubicSpline`, `GaussianBlur`, etc.).
- Don't reach into `Uint8ClampedArray` from a component — let the editor
  state object orchestrate the pipeline.

## Tooling

- Format: rely on the repo's ESLint / formatter config; do not switch
  formatters.
- Type-check before claiming done: `npm run check`.
- Smoke-run before shipping a visual change: `npm run test:run`.

## Rule Frontmatter

- YAML frontmatter values use **single quotes**. Do not change `'` to `"`.
- Keep `applyTo` populated; downstream tools (Copilot, Antigravity, Claude)
  read it.
