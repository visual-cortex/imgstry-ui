<script lang="ts">
  import { Collapsible } from 'bits-ui';
  import { editor } from '../editor/editor.svelte';
  import { GROUP_HUE, PRESETS, type Preset } from '../editor/presets';
  import Chevron from './Chevron.svelte';
  import Histogram from './Histogram.svelte';
  import RailCard from './RailCard.svelte';

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

  const groupHues = GROUP_HUE;
</script>

<aside class="left scroll">
  <RailCard title="Histogram">
    <Histogram />
  </RailCard>

  <RailCard title="Presets" badge={PRESETS.length}>
    {#each Object.entries(grouped) as [group, presets]}
      <Collapsible.Root bind:open={groupOpen[group]} class="group">
        <Collapsible.Trigger class="group-trigger">
          <span class="group-chev"><Chevron open={groupOpen[group]} /></span>
          <span class="group-dot" style:background={groupHues[group as keyof typeof groupHues] ?? 'var(--color-accent)'}></span>
          <span class="group-name">{group}</span>
          <span class="group-count">{presets.length}</span>
        </Collapsible.Trigger>
        <Collapsible.Content class="group-body">
          <ul>
            {#each presets as preset}
              <li>
                <button
                  class="preset"
                  disabled={!editor.hasImage}
                  onclick={() => editor.applyPreset(preset.patch, preset.name)}
                  style:--swatch={groupHues[group as keyof typeof groupHues] ?? 'var(--color-accent)'}
                >
                  <span class="swatch"></span>
                  <span class="name">{preset.name}</span>
                </button>
              </li>
            {/each}
          </ul>
        </Collapsible.Content>
      </Collapsible.Root>
    {/each}
  </RailCard>

  <RailCard title="History" badge={editor.history.length || null} grow>
    {#if editor.history.length === 0}
      <div class="empty-state">
        <p class="empty">No edits yet.</p>
        <p class="empty-hint">Open an image and start adjusting; every change lands here as a snapshot.</p>
      </div>
    {:else}
      <div class="timeline">
        <ul class="history-list">
          {#each [...editor.history].reverse() as entry, index}
            <li class:current={index === 0}>
              <button class="history-entry" onclick={() => editor.restoreHistory(entry)}>
                <span class="rail">
                  {#if index > 0}
                    <span class="connector"></span>
                  {/if}
                  <span class="node" class:head={index === 0}></span>
                </span>
                <span class="label">{entry.label}</span>
                {#if index === 0}
                  <span class="now">now</span>
                {/if}
              </button>
            </li>
          {/each}
        </ul>
        <p class="tip">Tip: tap any step to revert. Adjustments dedupe on snapshot.</p>
      </div>
    {/if}
  </RailCard>
</aside>

<style>
  aside.left {
    background: var(--color-bg-rail);
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 12px;
    flex: 1;
    min-height: 0;
    height: 100%;
  }

  :global(.left .group) {
    display: flex;
    flex-direction: column;
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  :global(.left .group + .group) {
    margin-top: 2px;
  }

  :global(.left .group-trigger) {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 6px 8px;
    background: transparent;
    border: none;
    color: var(--color-text);
    cursor: pointer;
    font-family: inherit;
    text-align: left;
    border-radius: var(--radius-sm);
  }

  :global(.left .group-trigger:hover) {
    background: var(--color-bg-elevated);
  }

  :global(.left .group-chev) {
    display: inline-flex;
    width: 12px;
  }

  :global(.left .group-dot) {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
    flex-shrink: 0;
  }

  :global(.left .group-name) {
    flex: 1;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.1px;
    color: var(--color-text);
  }

  :global(.left .group-count) {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--color-text-muted);
  }

  :global(.left .group-body) {
    padding: 2px 0 6px 22px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  li {
    margin: 0;
  }

  .preset {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 5px 8px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    color: var(--color-text-dim);
    font-size: 12px;
    text-align: left;
    cursor: pointer;
    transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
  }

  .preset:hover:not(:disabled) {
    color: var(--color-text);
    background: var(--color-bg-elevated);
  }

  .preset:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .swatch {
    width: 4px;
    height: 14px;
    border-radius: 2px;
    background: var(--swatch);
    opacity: 0.7;
    flex-shrink: 0;
  }

  .preset:hover .swatch {
    opacity: 1;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 24px 8px;
    text-align: center;
  }

  .empty {
    color: var(--color-text);
    font-size: 12px;
    font-weight: 600;
    margin: 0;
  }

  .empty-hint {
    color: var(--color-text-muted);
    font-size: 11px;
    margin: 0;
    line-height: 1.4;
  }

  .timeline {
    display: flex;
    flex-direction: column;
    position: relative;
    flex: 1;
    min-height: 0;
  }

  .history-list {
    gap: 0;
    flex-shrink: 0;
  }

  /*
   * Connector line lives per-entry. Each entry (except the first one
   * rendered, which is the most recent step) draws a line from the top
   * of its row up to its own node, joining the previous entry's node
   * to this one. Scales naturally to N entries and never extends past
   * the last node into the "tip" footer.
   */
  .connector {
    position: absolute;
    top: 0;
    bottom: 50%;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    background: var(--color-border);
    pointer-events: none;
  }

  .tip {
    margin-top: auto;
    padding: 10px 8px 4px;
    color: var(--color-text-muted);
    font-size: 10px;
    line-height: 1.5;
    border-top: 1px dashed var(--color-border-soft);
  }

  .history-entry {
    display: grid;
    grid-template-columns: 16px 1fr auto;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 6px 8px;
    background: transparent;
    border: none;
    color: var(--color-text-dim);
    font-size: 12px;
    text-align: left;
    cursor: pointer;
    position: relative;
    border-radius: var(--radius-sm);
  }

  .history-entry:hover {
    background: var(--color-bg-elevated);
    color: var(--color-text);
  }

  .current .history-entry {
    color: var(--color-text);
  }

  .rail {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 16px;
    align-self: stretch;
  }

  .node {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--color-text-muted);
    z-index: 1;
    transition: background 0.12s ease, box-shadow 0.12s ease;
    flex-shrink: 0;
    margin-top: 6px;
    box-shadow: 0 0 0 2px var(--color-bg-card);
  }

  .node.head {
    background: var(--color-accent);
    box-shadow: 0 0 0 2px var(--color-bg-card),
                0 0 0 5px var(--color-accent-soft);
  }

  .label {
    align-self: center;
  }

  .now {
    align-self: center;
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
  }
</style>
