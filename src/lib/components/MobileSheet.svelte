<script lang="ts">
  import { Dialog } from 'bits-ui';
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    title: string;
    children: Snippet;
    onclose: () => void;
  }

  const { open, title, children, onclose }: Props = $props();
</script>

<Dialog.Root open={open} onOpenChange={(next) => !next && onclose()}>
  <Dialog.Portal>
    <Dialog.Overlay class="sheet-overlay" />
    <Dialog.Content class="sheet">
      <header class="sheet-header">
        <Dialog.Title class="sheet-title">{title}</Dialog.Title>
        <Dialog.Close class="sheet-close" aria-label="Close">✕</Dialog.Close>
      </header>
      <div class="sheet-body scroll">
        {@render children()}
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  /* light overlay so the underlying image stays visible behind the sheet */
  :global(.sheet-overlay) {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(1px);
    z-index: 90;
  }

  :global(.sheet) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 91;
    background: color-mix(in srgb, var(--bg-rail) 96%, transparent);
    border-top: 1px solid var(--border);
    border-top-left-radius: var(--radius-lg);
    border-top-right-radius: var(--radius-lg);
    max-height: 55vh;
    display: flex;
    flex-direction: column;
    padding-bottom: env(safe-area-inset-bottom);
    box-shadow: 0 -12px 32px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
  }

  :global(.sheet-header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border-soft);
  }

  :global(.sheet-header::before) {
    content: '';
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    height: 4px;
    border-radius: 999px;
    background: var(--border);
  }

  :global(.sheet-title) {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  :global(.sheet-close) {
    background: transparent;
    border: none;
    color: var(--text-dim);
    font-size: 18px;
    cursor: pointer;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :global(.sheet-close:hover) {
    color: var(--text);
    background: var(--bg-elevated);
  }

  :global(.sheet-body) {
    overflow-y: auto;
    padding: 4px 8px 16px;
    flex: 1;
    min-height: 0;
  }
</style>
