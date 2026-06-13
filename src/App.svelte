<script lang="ts">
  import { onMount } from 'svelte';
  import LeftRail from './lib/components/LeftRail.svelte';
  import MobileAdjustStrip from './lib/components/MobileAdjustStrip.svelte';
  import MobileHistory from './lib/components/MobileHistory.svelte';
  import MobileSheet from './lib/components/MobileSheet.svelte';
  import MobileTabBar from './lib/components/MobileTabBar.svelte';
  import MobileTools from './lib/components/MobileTools.svelte';
  import RightRail from './lib/components/RightRail.svelte';
  import ToneCurve from './lib/components/ToneCurve.svelte';
  import TopBar from './lib/components/TopBar.svelte';
  import Viewport from './lib/components/Viewport.svelte';
  import { editor } from './lib/editor/editor.svelte';
  import { type MobilePane, mobile } from './lib/editor/mobile.svelte';

  const titleFor: Record<Exclude<MobilePane, 'adjust'>, string> = {
    curve: 'Tone Curve',
    tools: 'Tools',
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

  <!-- inline adjust strip lives above the tab bar on mobile -->
  <div class="mobile-strip">
    <MobileAdjustStrip />
  </div>

  <div class="tabbar">
    <MobileTabBar />
  </div>

  <MobileSheet
    open={mobile.open && mobile.activePane !== 'adjust'}
    title={mobile.activePane === 'adjust' ? '' : titleFor[mobile.activePane]}
    onclose={() => {
      mobile.open = false;
      mobile.activePane = 'adjust';
    }}
  >
    {#if mobile.activePane === 'curve'}
      <div class="curve-host">
        <ToneCurve />
      </div>
    {:else if mobile.activePane === 'tools'}
      <MobileTools />
    {:else if mobile.activePane === 'history'}
      <MobileHistory />
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

  .mobile-strip,
  .tabbar {
    display: none;
  }

  .curve-host {
    padding: 12px;
    display: flex;
    justify-content: center;
  }

  @media (max-width: 900px) {
    main {
      grid-template-columns: 1fr;
    }

    .left,
    .right {
      display: none;
    }

    .mobile-strip,
    .tabbar {
      display: block;
      flex-shrink: 0;
    }
  }
</style>
