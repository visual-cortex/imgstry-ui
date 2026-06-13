<script lang="ts">
  import { Collapsible } from 'bits-ui';
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    open?: boolean;
    children: Snippet;
  }

  const { title, open: defaultOpen = true, children }: Props = $props();
  // initial value only; bits-ui Collapsible owns the runtime toggle
  // svelte-ignore state_referenced_locally
  let open = $state(defaultOpen);
</script>

<Collapsible.Root bind:open class="panel">
  <Collapsible.Trigger class="header">
    <span class="caret">▸</span>
    <span class="title">{title}</span>
  </Collapsible.Trigger>
  <Collapsible.Content class="body">
    {@render children()}
  </Collapsible.Content>
</Collapsible.Root>

<style>
  :global(.panel) {
    border-bottom: 1px solid var(--border-soft);
  }

  :global(.panel .header) {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: flex-start;
    padding: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--text);
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    text-align: left;
  }

  :global(.panel .header:hover) {
    background: var(--bg-elevated);
  }

  :global(.panel .caret) {
    color: var(--text-muted);
    font-size: 9px;
    transition: transform .15s ease;
    display: inline-block;
  }

  :global(.panel[data-state='open'] .caret) {
    transform: rotate(90deg);
  }

  :global(.panel .body) {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 4px 12px 14px;
  }

  :global(.panel .body[hidden]) {
    display: none;
  }

  :global(.panel .title) {
    flex: 1;
  }
</style>
