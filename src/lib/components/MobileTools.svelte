<script lang="ts">
  import { editor } from '../editor/editor.svelte';
  import { mobile } from '../editor/mobile.svelte';
  import { GROUP_HUE, PRESETS, type Preset } from '../editor/presets';

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
    <section style:--hue={GROUP_HUE[group as keyof typeof GROUP_HUE]}>
      <h3>
        <span class="group-dot"></span>
        {group}
      </h3>
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
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 10px;
    font-weight: 700;
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .group-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--hue);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--hue) 18%, transparent);
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
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border-soft);
    border-radius: var(--radius-md);
    color: var(--color-text);
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    min-height: 44px;
  }

  .tool-card:hover:not(:disabled) {
    border-color: var(--color-accent);
    background: var(--color-accent-soft);
  }

  .tool-card:disabled {
    opacity: 0.4;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: var(--hue, var(--color-accent));
    flex-shrink: 0;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--hue, var(--color-accent)) 12%, transparent);
  }
</style>
