Before implementing anything, identify which domain you are working in and
read the corresponding rule file from `.agents/rules/` (only the core rules
auto-load via AGENTS.md; domain rules load on demand):

- Svelte UI surface (`src/lib/components/**`): read components.md
- Editor state, adjustments, color, presets (`src/lib/editor/**`): read
  editor.md
- Smoke / tests (`scripts/**`, `*.test.ts`, `*.spec.ts`): testing.md
  (already loaded as core)
- All other source code: project.md, code-principles.md, implementation.md
  (always-on baseline, already loaded as core).

@AGENTS.md
