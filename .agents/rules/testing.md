---
trigger: glob
globs: '**/*.{test,spec,mjs}'
description: 'Testing and smoke-run conventions for imgstry-ui.'
applyTo: '**/*.{test,spec,mjs}'
---

# Testing Guidelines

## What we run today

Smoke tests live in `scripts/` and run via Playwright (`smoke.mjs`,
`smoke-color.mjs`, `smoke-develop.mjs`). They drive the built app and assert
on the rendered viewport.

```bash
npm run test:run     # full smoke pass
```

## Testing Philosophy

- **Behavior over implementation.** Assert what the user sees, not which
  internal method was called.
- **Anchor on the engine output.** When a smoke test compares against a
  reference image, treat the engine's output as the ground truth — never
  pin to a debug snapshot.
- **Fast feedback first.** A smoke test that times out at 30 s is broken,
  not slow. Trim it.

## Adding a Smoke Scenario

- New scenarios live as `scripts/smoke-<name>.mjs` next to existing ones.
- Reuse the existing Playwright harness pattern; do not introduce a second
  way to bootstrap a page.
- Reference images go beside the script (`smoke-<name>.png`).

## Unit Tests (when introduced)

If unit tests land in the future:

- Vitest in jsdom.
- Pure helpers in `src/lib/editor/` (adjustments, color, presets) are the
  first targets.
- Top-level `describe` names the unit (`describe('adjustments: clone', ...)`).
- `it` titles read as sentences starting with `'should ...'`.

## What NOT to Test

- Don't test Svelte's rune mechanics — trust the framework.
- Don't snapshot full markup; assert on what changed.
