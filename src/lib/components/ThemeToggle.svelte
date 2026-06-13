<script lang="ts">
  import { theme } from '../editor/theme.svelte';
</script>

<button
  type="button"
  class="ghost theme-toggle"
  aria-label="Toggle theme"
  title="Toggle theme"
  onclick={() => theme.toggle()}
>
  {#if theme.mode === 'dark'}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>
    </svg>
  {:else}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  {/if}
</button>

<style>
  .theme-toggle.theme-toggle {
    /* doubled selector so it beats the TopBar's .actions :global(button) override */
    width: 36px;
    height: 36px;
    min-height: 36px;
    padding: 0;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    color: var(--color-text-dim);
    overflow: visible;
  }

  .theme-toggle:hover {
    color: var(--color-text);
  }

  .theme-toggle svg {
    width: 18px;
    height: 18px;
    display: block;
    flex-shrink: 0;
  }
</style>
