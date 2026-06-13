<script lang="ts">
  import { editor } from '../editor/editor.svelte';
  import { type MobilePane, mobile } from '../editor/mobile.svelte';

  // adjust lives inline as a thin strip; the other panes open as sheets
  const tabs: { id: MobilePane; label: string; icon: string }[] = [
    { id: 'adjust',  label: 'Adjust',  icon: '◐' },
    { id: 'curve',   label: 'Curve',   icon: '∿' },
    { id: 'tools',   label: 'Tools',   icon: '▦' },
    { id: 'history', label: 'History', icon: '↺' },
  ];

  const onTap = (id: MobilePane) => {
    if (id === 'adjust') {
      mobile.activePane = 'adjust';
      mobile.open = false;
      return;
    }
    if (mobile.activePane === id && mobile.open) {
      mobile.open = false;
      mobile.activePane = 'adjust';
      return;
    }
    mobile.activePane = id;
    mobile.open = true;
  };

  const isActive = (id: MobilePane) => {
    if (id === 'adjust') {
      return mobile.activePane === 'adjust' && !mobile.open;
    }
    return mobile.open && mobile.activePane === id;
  };
</script>

<nav class="tabbar" aria-label="editor panels">
  {#each tabs as tab}
    <button
      class="ghost tab"
      class:active={isActive(tab.id)}
      disabled={!editor.hasImage && tab.id !== 'tools'}
      onclick={() => onTap(tab.id)}
    >
      <span class="icon">{tab.icon}</span>
      <span class="label">{tab.label}</span>
    </button>
  {/each}
</nav>

<style>
  .tabbar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: var(--color-bg-rail);
    border-top: 1px solid var(--color-border);
    padding: 6px 4px calc(6px + env(safe-area-inset-bottom));
    gap: 4px;
    z-index: 50;
  }

  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 8px 4px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .5px;
    color: var(--color-text-muted);
    border-radius: var(--radius-md);
    background: transparent;
    border: none;
    min-height: 50px;
  }

  .tab.active {
    background: var(--color-accent-soft);
    color: var(--color-accent);
  }

  .tab .icon {
    font-size: 18px;
    line-height: 1;
  }

  .tab:disabled {
    opacity: 0.35;
  }
</style>
