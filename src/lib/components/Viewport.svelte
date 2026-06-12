<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { editor } from '../editor/editor.svelte';

  let canvas: HTMLCanvasElement;
  let dragging = $state(false);

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
  aria-label="Image viewport and drop zone"
  class:dragging
  ondragover={(event) => {
    event.preventDefault();
    dragging = true;
  }}
  ondragleave={() => (dragging = false)}
  ondrop={onDrop}
>
  <canvas bind:this={canvas} class:hidden={!editor.hasImage}></canvas>

  {#if !editor.hasImage}
    <div class="placeholder">
      <p class="title">Drop an image here</p>
      <p class="hint">or use Open in the top bar</p>
    </div>
  {/if}
</section>

<style>
  section {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    min-height: 0;
    padding: 24px;
    background:
      radial-gradient(circle at center, #202024 0%, var(--bg) 100%);
  }

  section.dragging {
    outline: 2px dashed var(--accent);
    outline-offset: -12px;
  }

  canvas {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
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
    font-size: 18px;
    margin: 0 0 4px;
  }

  .hint {
    font-size: 13px;
    margin: 0;
  }
</style>
