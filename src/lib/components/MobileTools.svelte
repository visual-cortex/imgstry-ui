<script lang="ts">
  import { editor } from '../editor/editor.svelte';
  import { mobile } from '../editor/mobile.svelte';
  import { PRESETS, type Preset } from '../editor/presets';

  const grouped = PRESETS.reduce((acc, preset) => {
    if (!acc[preset.group]) {
      acc[preset.group] = [];
    }
    acc[preset.group].push(preset);
    return acc;
  }, {} as Record<string, Preset[]>);

  const apply = (preset: Preset) => {
    editor.applyPreset(preset.patch, preset.name);
    mobile.open = false;
    mobile.activePane = 'adjust';
  };
</script>

<div class="tools">
  {#each Object.entries(grouped) as [group, presets]}
    <section>
      <h3>{group}</h3>
      <div class="grid">
        {#each presets as preset}
          <button
            class="tool-card"
            disabled={!editor.hasImage}
            onclick={() => apply(preset)}
          >
            <span class="dot"></span>
            {preset.name}
          </button>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  .tools {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 4px 8px 12px;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  h3 {
    margin: 0;
    font-size: 10px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 6px;
  }

  .tool-card {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-soft);
    border-radius: var(--radius);
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    min-height: 44px;
  }

  .tool-card:hover:not(:disabled) {
    border-color: var(--accent);
    background: var(--accent-soft);
  }

  .tool-card:disabled {
    opacity: 0.4;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: var(--accent);
    flex-shrink: 0;
  }
</style>
