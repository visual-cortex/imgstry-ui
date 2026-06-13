---
trigger: glob
globs: '**'
description: 'Functional programming, immutability, simplicity, and function design principles.'
applyTo: '**'
---

# Code Principles

## Functional Programming

- Prefer pure functions: same input -> same output.
- Side effects live at the edges (the editor state object, lifecycle hooks,
  event handlers). Adjustment math and helpers stay pure.

## Immutability

- `const` over `let` whenever possible.
- Adjustment snapshots are cloned (`structuredClone` or the existing
  `clone()` helper) when stored in history — never share references.
- Use TypeScript `readonly` types on shared shapes.

**Bad**

```ts
let result = [];
for (let i = 0; i < points.length; i++) {
  result.push(transform(points[i]));
}
```

**Good**

```ts
const result = points.map(transform);
```

## Early Exits

Guard clauses, not nested `if`s.

```ts
function previewOriginal(show: boolean) {
  if (!hasImage) return;
  if (show === showOriginal) return;
  // ...
}
```

## Code Smells to Avoid

- Nested conditionals beyond two levels.
- "God components" that own unrelated state.
- Components reaching into the editor's internals — call public methods.

## Function Design

- Single responsibility per function.
- 3+ parameters -> single object parameter.
- Pass dependencies as parameters; don't instantiate engine clients inside
  leaf helpers.

## Iteration Patterns

- `map` / `filter` / `reduce` over imperative loops.
- Avoid mutable loop counters.

## Type Safety

- Strict TS; no `any`.
- No non-null assertion (`!`). Handle `null` / `undefined` explicitly.
- Prefer `array.at(i)` for borderline-index access.

## Simplicity

- Small obvious solution > clever one.
- Three similar lines beat a premature abstraction.
- If a helper appears in 2+ components, lift it to `src/lib/editor/` or a
  shared `utils` file.
