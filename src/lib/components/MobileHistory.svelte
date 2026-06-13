<script lang="ts">
  import { editor } from '../editor/editor.svelte';
  import { mobile } from '../editor/mobile.svelte';
</script>

<div class="history">
  {#if editor.history.length === 0}
    <p class="empty">No history yet. Open an image and start adjusting.</p>
  {:else}
    <ul>
      {#each [...editor.history].reverse() as entry, index}
        <li>
          <button
            class="entry"
            onclick={() => {
              editor.restoreHistory(entry);
              mobile.open = false;
              mobile.activePane = 'adjust';
            }}
          >
            <span class="dot" class:head={index === 0}></span>
            <span class="label">{entry.label}</span>
            {#if index === 0}
              <span class="badge">latest</span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .history {
    padding: 4px 12px 12px;
  }

  .empty {
    color: var(--text-muted);
    font-size: 13px;
    margin: 16px 0;
    text-align: center;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .entry {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    background: transparent;
    border: none;
    border-radius: var(--radius);
    color: var(--text);
    text-align: left;
    cursor: pointer;
    font-size: 13px;
    min-height: 44px;
  }

  .entry:hover {
    background: var(--bg-elevated);
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--text-muted);
    flex-shrink: 0;
  }

  .dot.head {
    background: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  .label {
    flex: 1;
  }

  .badge {
    font-size: 10px;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
  }
</style>
