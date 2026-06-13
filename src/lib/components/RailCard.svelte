<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    badge?: string | number | null;
    actions?: Snippet;
    grow?: boolean;
    children: Snippet;
  }

  const { title, badge, actions, grow = false, children }: Props = $props();
</script>

<section class="card" class:grow>
  <header>
    <h2>{title}</h2>
    {#if badge !== undefined && badge !== null && badge !== ''}
      <span class="badge">{badge}</span>
    {/if}
    {#if actions}
      <div class="actions">{@render actions()}</div>
    {/if}
  </header>
  <div class="body">
    {@render children()}
  </div>
</section>

<style>
  .card {
    background: var(--color-bg-card);
    border: 1px solid var(--color-border-soft);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;
    min-height: 0;
  }

  .card.grow {
    flex: 1 1 auto;
  }

  .card.grow {
    flex: 1 1 0;
    min-height: 200px;
  }

  .card.grow .body {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--color-border) transparent;
  }

  .card.grow .body::-webkit-scrollbar {
    width: 6px;
  }

  .card.grow .body::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 3px;
  }

  header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px 8px;
    border-bottom: 1px solid var(--color-border-soft);
    background: rgba(255, 255, 255, 0.015);
  }

  h2 {
    margin: 0;
    font-size: 10px;
    font-weight: 700;
    color: var(--color-text);
    text-transform: uppercase;
    letter-spacing: 1.4px;
    flex: 1;
  }

  .badge {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--color-text-dim);
    background: var(--color-bg-input);
    padding: 2px 6px;
    border-radius: 999px;
    font-weight: 500;
  }

  .actions {
    display: flex;
    gap: 4px;
  }

  .body {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
</style>
