<script lang="ts">
  import { editor } from '../editor/editor.svelte';
  import { DEFAULT_ADJUSTMENTS } from '../editor/adjustments';

  const numericKeys = Object.entries(DEFAULT_ADJUSTMENTS)
    .filter(([, value]) => typeof value === 'number')
    .map(([key]) => key);

  const dirty = $derived.by(() => {
    const adjustments = editor.adjustments;
    return numericKeys.reduce((count, key) => {
      const k = key as keyof typeof DEFAULT_ADJUSTMENTS;
      return adjustments[k] !== DEFAULT_ADJUSTMENTS[k] ? count + 1 : count;
    }, 0);
  });

  const tonal = $derived(editor.histogram ? Math.round(
    editor.histogram.all.reduce((sum, p, i) => sum + p * i, 0),
  ) : null);
</script>

<div class="filler" aria-hidden="true">
  <div class="grid">
    {#each Array(8 * 14) as _, i}
      <span class="cell" style:--row={Math.floor(i / 8)} style:--col={i % 8}></span>
    {/each}
  </div>

  {#if editor.hasImage}
    <dl class="stats">
      <div>
        <dt>Pixels</dt>
        <dd>{((editor.dimensions?.width ?? 0) * (editor.dimensions?.height ?? 0)).toLocaleString()}</dd>
      </div>
      <div>
        <dt>Adjustments</dt>
        <dd>{dirty}<span class="of">/ {numericKeys.length}</span></dd>
      </div>
      <div>
        <dt>Mean tone</dt>
        <dd>{tonal ?? '—'}</dd>
      </div>
      <div>
        <dt>History</dt>
        <dd>{editor.history.length}</dd>
      </div>
    </dl>
  {:else}
    <p class="cta">Drop an image or hit Open to begin.</p>
  {/if}
</div>

<style>
  .filler {
    flex: 1;
    min-height: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 18px 14px;
    overflow: hidden;
  }

  .grid {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    pointer-events: none;
    opacity: .35;
  }

  .cell {
    border-right: 1px solid var(--border-soft);
    border-bottom: 1px solid var(--border-soft);
    aspect-ratio: 1;
    background:
      radial-gradient(
        circle at center,
        rgba(106, 168, 255, calc(.05 + (8 - var(--col, 0)) * .005)) 0%,
        transparent 70%
      );
  }

  .stats {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 14px;
    margin: 0;
  }

  .stats div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  dt {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: var(--text-muted);
    font-weight: 600;
  }

  dd {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }

  .of {
    color: var(--text-muted);
    margin-left: 4px;
    font-size: 11px;
  }

  .cta {
    position: relative;
    margin: 0;
    color: var(--text-muted);
    font-size: 11px;
    line-height: 1.5;
    text-align: center;
  }
</style>
