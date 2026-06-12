<script lang="ts">
  import AdjustmentPanel from './lib/components/AdjustmentPanel.svelte';
  import Histogram from './lib/components/Histogram.svelte';
  import TopBar from './lib/components/TopBar.svelte';
  import Viewport from './lib/components/Viewport.svelte';
</script>

<div class="studio">
  <TopBar />

  <main>
    <Viewport />

    <aside>
      <Histogram />
      <AdjustmentPanel />
    </aside>
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
    grid-template-columns: 1fr 300px;
    flex: 1;
    min-height: 0;
  }

  aside {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    background: var(--bg-panel);
    border-left: 1px solid var(--border);
    overflow-y: auto;
  }
</style>
