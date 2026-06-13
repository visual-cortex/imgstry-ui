<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { editor } from '../editor/editor.svelte';

  let canvas: HTMLCanvasElement;
  let dragging = $state(false);
  let zoom = $state<'fit' | '1:1' | '2:1'>('fit');

  const zoomToScale = (mode: typeof zoom): string => {
    if (mode === 'fit') return 'fit';
    if (mode === '1:1') return '100%';
    return '200%';
  };

  onMount(() => {
    editor.attach(canvas);
  });

  onDestroy(() => {
    editor.detach();
  });

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    dragging = false;

    const file = event.dataTransfer?.files?.[0];

    if (file?.type.startsWith('image/')) {
      void editor.open(file);
    }
  };
</script>

<section
  aria-label="Image viewport"
  class:dragging
  ondragover={(event) => {
    event.preventDefault();
    dragging = true;
  }}
  ondragleave={() => (dragging = false)}
  ondrop={onDrop}
>
  <div class="canvas-stage" class:fit={zoom === 'fit'}>
    <canvas bind:this={canvas} class:hidden={!editor.hasImage} class:one={zoom === '1:1'} class:two={zoom === '2:1'}></canvas>

    {#if !editor.hasImage}
      <div class="placeholder">
        <p class="title">Drop an image to begin</p>
        <p class="hint">or use Open in the top bar</p>
        <p class="kbd">supports JPG · PNG · WEBP · AVIF</p>
      </div>
    {/if}
  </div>

  {#if editor.hasImage}
    <div class="toolbar">
      <div class="group">
        <button class="ghost" class:active={zoom === 'fit'} onclick={() => (zoom = 'fit')}>Fit</button>
        <button class="ghost" class:active={zoom === '1:1'} onclick={() => (zoom = '1:1')}>1:1</button>
        <button class="ghost" class:active={zoom === '2:1'} onclick={() => (zoom = '2:1')}>2:1</button>
      </div>
      <span class="zoom-readout">{zoomToScale(zoom)}</span>
    </div>
  {/if}
</section>

<style>
  section {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-width: 0;
    min-height: 0;
    background:
      radial-gradient(ellipse at center, #232326 0%, #131315 100%);
  }

  section.dragging::after {
    content: '';
    position: absolute;
    inset: 16px;
    border: 2px dashed var(--accent);
    border-radius: var(--radius-lg);
    pointer-events: none;
  }

  .canvas-stage {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px;
    overflow: auto;
  }

  canvas {
    border-radius: 4px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05);
    background: #000;
  }

  .canvas-stage.fit canvas {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  canvas.one {
    width: auto;
    height: auto;
  }

  canvas.two {
    transform: scale(2);
    transform-origin: center;
  }

  canvas.hidden {
    display: none;
  }

  .placeholder {
    text-align: center;
    color: var(--text-dim);
    pointer-events: none;
  }

  .title {
    font-size: 20px;
    margin: 0 0 6px;
    color: var(--text);
    font-weight: 500;
  }

  .hint {
    font-size: 13px;
    margin: 0 0 16px;
  }

  .kbd {
    color: var(--text-muted);
    font-size: 11px;
    margin: 0;
    letter-spacing: .5px;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 14px;
    background: rgba(0, 0, 0, 0.4);
    border-top: 1px solid var(--border);
    backdrop-filter: blur(8px);
  }

  .group {
    display: flex;
    gap: 2px;
  }

  .group button {
    font-size: 11px;
    padding: 3px 10px;
  }

  .group button.active {
    background: var(--accent-soft);
    color: var(--accent);
  }

  .zoom-readout {
    color: var(--text-dim);
    font-family: var(--font-mono);
    font-size: 11px;
  }
</style>
