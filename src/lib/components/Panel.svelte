<script lang="ts">
  import { Collapsible } from 'bits-ui';
  import type { Snippet } from 'svelte';
  import Chevron from './Chevron.svelte';

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
    <Chevron {open} />
    <span class="title">{title}</span>
  </Collapsible.Trigger>
  <Collapsible.Content class="body">
    {@render children()}
  </Collapsible.Content>
</Collapsible.Root>

<style>
  :global(.panel) {
    border-bottom: 1px solid var(--color-border-soft);
  }

  :global(.panel .header) {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-start;
    padding: 12px 14px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-text);
    font-family: inherit;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.4px;
    text-align: left;
    transition: background 0.12s ease;
  }

  :global(.panel .header:hover) {
    background: var(--color-bg-elevated);
  }

  :global(.panel .body) {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 4px 14px 16px;
  }

  :global(.panel .body[hidden]) {
    display: none;
  }

  :global(.panel .title) {
    flex: 1;
  }
</style>
