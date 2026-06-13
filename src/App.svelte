<script lang="ts">
  import { onMount } from 'svelte';
  import LeftRail from './lib/components/LeftRail.svelte';
  import RightRail from './lib/components/RightRail.svelte';
  import TopBar from './lib/components/TopBar.svelte';
  import Viewport from './lib/components/Viewport.svelte';
  import { editor } from './lib/editor/editor.svelte';

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
    <LeftRail />
    <Viewport />
    <RightRail />
  </main>
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
</style>
