<script lang="ts">
  import { editor } from '../editor/editor.svelte';
  import { type MobilePane, mobile } from '../editor/mobile.svelte';

  const tabs: { id: MobilePane; label: string; icon: string }[] = [
    { id: 'adjust',  label: 'Adjust',  icon: '◐' },
    { id: 'curve',   label: 'Curve',   icon: '∿' },
    { id: 'presets', label: 'Presets', icon: '▦' },
    { id: 'history', label: 'History', icon: '↺' },
  ];

  const onTap = (id: MobilePane) => {
    if (mobile.activePane === id && mobile.open) {
      mobile.open = false;
    } else {
      mobile.activePane = id;
      mobile.open = true;
    }
  };
</script>

<nav class="tabbar" aria-label="editor panels">
  {#each tabs as tab}
    <button
      class="ghost tab"
      class:active={mobile.open && mobile.activePane === tab.id}
      disabled={!editor.hasImage && tab.id !== 'presets'}
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
    background: var(--bg-rail);
    border-top: 1px solid var(--border);
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
    color: var(--text-muted);
    border-radius: var(--radius);
    background: transparent;
    border: none;
    min-height: 50px;
  }

  .tab.active {
    background: var(--accent-soft);
    color: var(--accent);
  }

  .tab .icon {
    font-size: 18px;
    line-height: 1;
  }

  .tab:disabled {
    opacity: 0.35;
  }
</style>
