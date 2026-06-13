---
trigger: glob
globs: 'src/lib/components/**'
description: 'Conventions for Svelte 5 UI components — rails, viewport, sliders, curve, picker.'
applyTo: 'src/lib/components/**'
---

# Components Guidelines

## Scope

`src/lib/components/` is the presentational surface: rails, viewport,
sliders, color picker, tone curve, histogram, panel.

## Hard Rules

- **Presentational, not stateful.** Components render the editor state and
  call its methods. They do not own duplicate copies of editor state.
- **No pixel math.** If a component needs to compute pixel values, the helper
  belongs in `src/lib/editor/` (or upstream in `imgstry`).
- **No direct engine calls.** Components do not import from `imgstry`
  directly; they go through the editor state object.

## Svelte 5 Runes

- `$props()` declares props (never `export let`).
- `$derived` for computed values.
- `$effect` sparingly — only for side effects that cannot be expressed as a
  derived value (event listener registration, focus calls, canvas
  rendering).

```svelte
<script lang="ts">
  import { editor } from '../editor/editor.svelte';

  const { label, min = 0, max = 1 }: { label: string; min?: number; max?: number } = $props();
  const value = $derived(editor.adjustments[label]);
</script>
```

## Props Type Files

For components with 3+ props, define a co-located `ComponentNameProps.ts`
file or an inline `type` block at the top of the component. Don't pass
opaque shapes — name them.

## Snippets for Composition

Use `{#snippet}` + `Snippet` type for slot-like composition. Avoid legacy
`<slot>`.

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  const { children, footer }: { children: Snippet; footer?: Snippet } = $props();
</script>

<section class="panel">
  {@render children()}
  {#if footer}<footer>{@render footer()}</footer>{/if}
</section>
```

## Styling

- Use `<style>` blocks scoped to the component (`<style>` without `:global`
  by default).
- CSS variables for shared tokens (spacing, colors, radii). No hex literals
  inside components when a token exists.
- `kebab-case` class names.

## Event Handlers

- Use `on:event` props passed in via `$props()` for parent-driven events.
- Editor mutations go through the editor methods, not bespoke event types.

## Performance

- Heavy rendering (canvas, large lists) sits behind a debounced effect or a
  reactive `$derived` that runs only on real change.
- Don't re-bind global listeners on every render — move them into the editor
  or a top-level component (see `App.svelte`'s keydown handler).
