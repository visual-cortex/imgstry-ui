<script lang="ts">
  import { pwa } from '../editor/pwa.svelte';
</script>

<div class="pwa-stack" aria-live="polite">
  {#if !pwa.online}
    <div class="pwa-toast offline" role="status">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.58 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
      </svg>
      <span>Offline. All edits stay local.</span>
    </div>
  {/if}

  {#if pwa.offlineReady}
    <div class="pwa-toast ready" role="status">
      <span>Ready to fly. Cached for offline use.</span>
      <button class="pwa-action" onclick={() => pwa.dismissReady()}>OK</button>
    </div>
  {/if}

  {#if pwa.needsRefresh}
    <div class="pwa-toast refresh" role="status">
      <span>New version available.</span>
      <button class="pwa-action" onclick={() => pwa.refresh()}>Reload</button>
    </div>
  {/if}

  {#if pwa.canInstall}
    <button class="pwa-toast install" onclick={() => pwa.install()}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
      <span>Install imgstry</span>
    </button>
  {/if}
</div>

<style>
  .pwa-stack {
    position: fixed;
    bottom: calc(var(--space-lg) + env(safe-area-inset-bottom));
    right: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    z-index: var(--layer-toast);
    pointer-events: none;
  }

  .pwa-toast {
    pointer-events: auto;
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-lg);
    background: var(--color-bg-elevated);
    border: var(--border-thin) solid var(--color-border);
    border-radius: var(--radius-pill);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    box-shadow: var(--shadow-lift);
    backdrop-filter: blur(8px);
  }

  .pwa-toast.offline {
    color: var(--color-warn);
    border-color: color-mix(in srgb, var(--color-warn) 40%, transparent);
    background: color-mix(in srgb, var(--color-warn) 8%, var(--color-bg-elevated));
  }

  .pwa-toast.ready {
    color: var(--color-ok);
    border-color: color-mix(in srgb, var(--color-ok) 40%, transparent);
  }

  .pwa-toast.refresh {
    color: var(--color-accent);
    border-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
  }

  .pwa-toast.install {
    background: var(--color-accent-grad);
    border-color: transparent;
    color: #fff;
    cursor: pointer;
    font-weight: var(--font-weight-semi);
  }

  .pwa-action {
    margin-left: var(--space-xs);
    padding: var(--space-xxs) var(--space-md);
    background: transparent;
    border: var(--border-thin) solid currentColor;
    border-radius: var(--radius-pill);
    color: inherit;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semi);
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
  }

  .pwa-action:hover {
    background: color-mix(in srgb, currentColor 15%, transparent);
  }
</style>
