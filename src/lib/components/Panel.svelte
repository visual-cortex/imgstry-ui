<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    open?: boolean;
    children: Snippet;
  }

  const propsValue: Props = $props();
  let { title, children } = propsValue;
  let isOpen = $state(propsValue.open ?? true);
</script>

<section class="panel">
  <button class="ghost header" onclick={() => (isOpen = !isOpen)}>
    <span class="caret" class:open={isOpen}>▸</span>
    <span class="title">{title}</span>
  </button>
  {#if isOpen}
    <div class="body">
      {@render children()}
    </div>
  {/if}
</section>

<style>
  .panel {
    border-bottom: 1px solid var(--border-soft);
  }

  .header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: flex-start;
    padding: 8px 12px;
    border-radius: 0;
    background: transparent;
    border: none;
  }

  .header:hover {
    background: var(--bg-elevated);
  }

  .caret {
    color: var(--text-muted);
    font-size: 9px;
    transition: transform .15s ease;
  }

  .caret.open {
    transform: rotate(90deg);
  }

  .title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text);
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 4px 12px 14px;
  }
</style>
