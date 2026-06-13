<script lang="ts">
  import { onMount } from 'svelte';
  import LeftRail from './lib/components/LeftRail.svelte';
  import MobileSheet from './lib/components/MobileSheet.svelte';
  import MobileTabBar from './lib/components/MobileTabBar.svelte';
  import RightRail from './lib/components/RightRail.svelte';
  import TopBar from './lib/components/TopBar.svelte';
  import Viewport from './lib/components/Viewport.svelte';
  import ToneCurve from './lib/components/ToneCurve.svelte';
  import { editor } from './lib/editor/editor.svelte';
  import { mobile, type MobilePane } from './lib/editor/mobile.svelte';

  const titleFor: Record<MobilePane, string> = {
    adjust: 'Adjust',
    curve: 'Tone Curve',
    presets: 'Presets',
    history: 'History',
  };

  onMount(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!editor.hasImage) {
        return;
      }
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (event.key === '\\') {
        event.preventDefault();
        editor.previewOriginal(!editor.showOriginal);
      } else if (event.key === 'r' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        editor.resetAdjustments();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

<div class="studio">
  <TopBar />

  <main>
    <div class="left"><LeftRail /></div>
    <Viewport />
    <div class="right"><RightRail /></div>
  </main>

  <div class="tabbar">
    <MobileTabBar />
  </div>

  <MobileSheet
    open={mobile.open}
    title={titleFor[mobile.activePane]}
    onclose={() => (mobile.open = false)}
  >
    {#if mobile.activePane === 'adjust'}
      <RightRail />
    {:else if mobile.activePane === 'curve'}
      <div class="curve-host">
        <ToneCurve />
      </div>
    {:else if mobile.activePane === 'presets'}
      <div class="mobile-rail"><LeftRail /></div>
    {:else if mobile.activePane === 'history'}
      <div class="mobile-rail"><LeftRail /></div>
    {/if}
  </MobileSheet>
</div>

<style>
  .studio {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  main {
    display: grid;
    grid-template-columns: 220px 1fr 320px;
    flex: 1;
    min-height: 0;
    background: var(--bg);
  }

  .left,
  .right {
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .tabbar {
    display: none;
  }

  .curve-host {
    padding: 12px;
    display: flex;
    justify-content: center;
  }

  .mobile-rail {
    display: contents;
  }

  @media (max-width: 900px) {
    main {
      grid-template-columns: 1fr;
    }

    .left,
    .right {
      display: none;
    }

    .tabbar {
      display: block;
    }
  }
</style>
