<script lang="ts">
  import { Collapsible } from 'bits-ui';
  import { editor } from '../editor/editor.svelte';
  import { PRESETS, type Preset } from '../editor/presets';
  import Histogram from './Histogram.svelte';

  const grouped = PRESETS.reduce((acc, preset) => {
    if (!acc[preset.group]) {
      acc[preset.group] = [];
    }
    acc[preset.group].push(preset);
    return acc;
  }, {} as Record<string, Preset[]>);

  const groupOpen = $state<Record<string, boolean>>(
    Object.fromEntries(Object.keys(grouped).map((group) => [group, true])),
  );
</script>

<aside class="left scroll">
  <Histogram />

  <section>
    <header>
      <h2>Presets</h2>
    </header>

    {#each Object.entries(grouped) as [group, presets]}
      <Collapsible.Root bind:open={groupOpen[group]} class="group">
        <Collapsible.Trigger class="group-header">
          <span class="caret">▸</span>
          {group}
        </Collapsible.Trigger>
        <Collapsible.Content>
          <ul>
            {#each presets as preset}
              <li>
                <button
                  class="ghost preset"
                  disabled={!editor.hasImage}
                  onclick={() => editor.applyPreset(preset.patch, preset.name)}
                >
                  {preset.name}
                </button>
              </li>
            {/each}
          </ul>
        </Collapsible.Content>
      </Collapsible.Root>
    {/each}
  </section>

  <section>
    <header>
      <h2>History</h2>
    </header>
    {#if editor.history.length === 0}
      <p class="empty">No history yet.</p>
    {:else}
      <ul>
        {#each [...editor.history].reverse() as entry}
          <li>
            <button class="ghost history" onclick={() => editor.restoreHistory(entry)}>
              {entry.label}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</aside>

<style>
  aside.left {
    background: var(--bg-rail);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 8px;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  section header {
    padding: 0 6px;
  }

  h2 {
    margin: 0;
    font-size: 10px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  :global(.group) {
    display: flex;
    flex-direction: column;
  }

  :global(.group-header) {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: flex-start;
    color: var(--text-dim);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 6px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: inherit;
    text-align: left;
    width: 100%;
  }

  :global(.group-header:hover) {
    color: var(--text);
  }

  :global(.group-header .caret) {
    color: var(--text-muted);
    transition: transform .12s ease;
    font-size: 9px;
    display: inline-block;
  }

  :global(.group[data-state='open'] .caret) {
    transform: rotate(90deg);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0 0 0 12px;
    display: flex;
    flex-direction: column;
  }

  li {
    margin: 0;
  }

  button.preset,
  button.history {
    width: 100%;
    text-align: left;
    justify-content: flex-start;
    padding: 6px 8px;
    font-size: 12px;
    color: var(--text-dim);
    border-radius: 4px;
    min-height: 32px;
  }

  button.preset:hover:not(:disabled),
  button.history:hover {
    color: var(--text);
    background: var(--bg-elevated);
  }

  button.history {
    color: var(--text-muted);
    font-size: 11px;
  }

  .empty {
    color: var(--text-muted);
    font-size: 11px;
    margin: 0;
    padding: 4px 12px;
  }
</style>
