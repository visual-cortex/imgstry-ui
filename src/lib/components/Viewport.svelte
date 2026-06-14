<script lang="ts">
  import { isRawExtension } from 'imgstry';
  import { onDestroy, onMount } from 'svelte';
  import { editor } from '../editor/editor.svelte';

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 8;
  // wheel: mouse wheel notches deliver deltaY ~100, this keeps one
  // notch around +15%.
  const WHEEL_STEP = 0.0015;
  // pinch: trackpad gestures arrive as wheel + ctrlKey with tiny
  // deltaY (1-4 per event), so each event needs a much bigger
  // multiplier to track the fingers.
  const PINCH_STEP = 0.02;

  let canvas: HTMLCanvasElement;
  let stage: HTMLDivElement;
  let dragging = $state(false);
  let zoom = $state(1);
  let panX = $state(0);
  let panY = $state(0);

  const activePointers = new Map<number, { x: number; y: number }>();
  let pinchStart: { distance: number; zoom: number } | null = null;
  let panning = $state<{ id: number; x: number; y: number } | null>(null);

  const clamp = (value: number, lo: number, hi: number) =>
    value < lo ? lo : value > hi ? hi : value;

  const constrain = () => {
    if (zoom <= MIN_ZOOM) {
      panX = 0;
      panY = 0;
      zoom = MIN_ZOOM;
      return;
    }
    const rect = stage.getBoundingClientRect();
    const maxX = (rect.width * (zoom - 1)) / 2;
    const maxY = (rect.height * (zoom - 1)) / 2;
    panX = clamp(panX, -maxX, maxX);
    panY = clamp(panY, -maxY, maxY);
  };

  const zoomAt = (clientX: number, clientY: number, nextZoom: number) => {
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // Keep the point under the cursor stationary on screen.
    const px = clientX - cx;
    const py = clientY - cy;
    const ratio = nextZoom / zoom;
    panX = panX * ratio + px * (1 - ratio);
    panY = panY * ratio + py * (1 - ratio);
    zoom = nextZoom;
    constrain();
  };

  const onWheel = (event: WheelEvent) => {
    if (!editor.hasImage) return;
    event.preventDefault();
    const step = event.ctrlKey ? PINCH_STEP : WHEEL_STEP;
    const delta = -event.deltaY;
    const next = clamp(zoom * Math.exp(delta * step), MIN_ZOOM, MAX_ZOOM);
    if (next !== zoom) {
      zoomAt(event.clientX, event.clientY, next);
    }
  };

  const onPointerDown = (event: PointerEvent) => {
    if (!editor.hasImage) return;
    stage.setPointerCapture(event.pointerId);
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (activePointers.size === 2) {
      const [a, b] = [...activePointers.values()];
      pinchStart = {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        zoom,
      };
      panning = null;
    } else if (activePointers.size === 1 && zoom > MIN_ZOOM) {
      panning = { id: event.pointerId, x: event.clientX, y: event.clientY };
    }
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!activePointers.has(event.pointerId)) return;
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pinchStart && activePointers.size === 2) {
      const [a, b] = [...activePointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const next = clamp((distance / pinchStart.distance) * pinchStart.zoom, MIN_ZOOM, MAX_ZOOM);
      const centerX = (a.x + b.x) / 2;
      const centerY = (a.y + b.y) / 2;
      zoomAt(centerX, centerY, next);
      return;
    }

    if (panning && panning.id === event.pointerId) {
      panX += event.clientX - panning.x;
      panY += event.clientY - panning.y;
      panning = { id: event.pointerId, x: event.clientX, y: event.clientY };
      constrain();
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    activePointers.delete(event.pointerId);
    if (activePointers.size < 2) {
      pinchStart = null;
    }
    if (panning && panning.id === event.pointerId) {
      panning = null;
    }
    if (activePointers.size === 1 && zoom > MIN_ZOOM) {
      const [only] = [...activePointers.entries()];
      panning = { id: only[0], x: only[1].x, y: only[1].y };
    }
  };

  const resetZoom = () => {
    zoom = MIN_ZOOM;
    panX = 0;
    panY = 0;
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

    if (file && (file.type.startsWith('image/') || isRawExtension(file.name))) {
      void editor.open(file);
    }
  };

  const zoomLabel = $derived(`${Math.round(zoom * 100)}%`);
  const transform = $derived(
    `translate3d(${panX}px, ${panY}px, 0) scale(${zoom})`,
  );
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
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
  <div
    bind:this={stage}
    class="canvas-stage"
    onwheel={onWheel}
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerUp}
    ondblclick={resetZoom}
    style:--cursor={zoom > MIN_ZOOM ? (panning ? 'grabbing' : 'grab') : 'default'}
  >
    <canvas
      bind:this={canvas}
      class:hidden={!editor.hasImage}
      style:transform
    ></canvas>

    {#if !editor.hasImage}
      <div class="placeholder">
        <p class="title">Drop an image to begin</p>
        <p class="hint">or use Open in the top bar</p>
        <p class="kbd">supports JPG · PNG · WEBP · AVIF · RAW</p>
      </div>
    {/if}

    {#if editor.hasImage && zoom > MIN_ZOOM}
      <div class="zoom-badge">
        <span class="value">{zoomLabel}</span>
        <button class="reset" onclick={resetZoom} aria-label="Reset zoom">↺</button>
      </div>
    {/if}
  </div>
</section>

<style>
  section {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-width: 0;
    min-height: 0;
    background: var(--color-viewport-stage);
  }

  section.dragging::after {
    content: '';
    position: absolute;
    inset: 16px;
    border: 2px dashed var(--color-accent);
    border-radius: var(--radius-lg);
    pointer-events: none;
    z-index: 5;
  }

  .canvas-stage {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px;
    overflow: hidden;
    touch-action: none;
    cursor: var(--cursor, default);
  }

  canvas {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05);
    background: #000;
    transform-origin: center;
    will-change: transform;
  }

  canvas.hidden {
    display: none;
  }

  .placeholder {
    text-align: center;
    color: var(--color-text-dim);
    pointer-events: none;
  }

  .title {
    font-size: 20px;
    margin: 0 0 6px;
    color: var(--color-text);
    font-weight: 500;
  }

  .hint {
    font-size: 13px;
    margin: 0 0 16px;
  }

  .kbd {
    color: var(--color-text-muted);
    font-size: 11px;
    margin: 0;
    letter-spacing: .5px;
  }

  .zoom-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 4px 4px 10px;
    background: rgba(0, 0, 0, 0.55);
    color: var(--color-text);
    font-family: var(--font-mono);
    font-size: 11px;
    border-radius: 999px;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    pointer-events: auto;
  }

  .zoom-badge .value {
    font-variant-numeric: tabular-nums;
  }

  .zoom-badge .reset {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: none;
    background: rgba(255, 255, 255, 0.08);
    color: var(--color-text);
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .zoom-badge .reset:hover {
    background: var(--color-accent);
  }
</style>
