---
trigger: glob
globs: 'src/lib/editor/**'
description: 'Editor state, adjustments, color helpers, presets — single source of truth wiring imgstry.'
applyTo: 'src/lib/editor/**'
---

# Editor Guidelines

## Scope

`src/lib/editor/` holds the editor state and the helpers that translate UI
intent into `imgstry` engine calls.

```
editor/
  editor.svelte.ts   # the live editor state (runes)
  adjustments.ts     # Adjustments shape, defaults, derived params
  color.ts           # color helpers
  presets.ts         # named adjustment presets
```

## Hard Rules

- **Single source of truth.** The editor state object is the only place
  long-lived adjustment state lives. Components mirror, not duplicate.
- **No DOM access inside helpers.** Pure modules (`adjustments.ts`,
  `color.ts`, `presets.ts`) must stay DOM-free so they remain testable.
- **Engine API only.** Reach for the public `imgstry` surface; do not
  import internal pixel utilities.

## Editor State Object

- Lives in `editor.svelte.ts`. Exports a single `editor` object built on
  runes.
- Public methods read as user actions: `loadImage`, `applyPreset`,
  `previewOriginal`, `resetAdjustments`, `undo`, `redo`.
- Internal helpers are not exported.

## Adjustments

- The `Adjustments` shape is the contract between UI and engine. Add new
  fields here, not in components.
- `DEFAULT_ADJUSTMENTS` is the identity (no-op) state. `isPristine` checks
  against it.
- Derived parameters (e.g. kernel shapes, blur radii) belong next to the
  adjustment they describe.

## History

- Each entry is a deep clone of `Adjustments` + a label.
- Undo restores the snapshot, then re-renders through the engine.
- Don't store engine instances in history — only data.

## Rendering Pipeline

- Render runs are debounced (`RENDER_DEBOUNCE_MS`).
- A single in-flight render at a time; queue trailing updates rather than
  racing them.
- "Preview original" short-circuits the pipeline; restore is a normal
  re-render.

## Color & Presets

- Color helpers (`color.ts`) are pure and locale-agnostic.
- Presets (`presets.ts`) are named adjustment records. Adding a preset is
  three lines: name, label, `Adjustments` literal. No imperative setup.

## When to Add a New Module

| Question                                                  | Place in              |
| --------------------------------------------------------- | --------------------- |
| Is it a piece of editor state or a public editor method?  | `editor.svelte.ts`    |
| Is it a pure data shape / default / derivation?           | `adjustments.ts`      |
| Is it color math?                                         | `color.ts`            |
| Is it a named bundle of adjustments?                      | `presets.ts`          |
| Is it engine-side (pixel math, kernels)?                  | upstream in `imgstry` |
