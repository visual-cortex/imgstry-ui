<script lang="ts">
  import { CubicSpline } from 'imgstry';
  import { editor } from '../editor/editor.svelte';
  import type { ToneCurvePoint } from '../editor/adjustments';

  type CurveChannel = 'rgb' | 'red' | 'green' | 'blue';

  const SIZE = 220;
  const PADDING = 8;
  const PLOT = SIZE - PADDING * 2;

  let channel = $state<CurveChannel>('rgb');

  const points = $derived(editor.adjustments.curves[channel]);

  let svg: SVGSVGElement;
  let dragIndex = $state<number | null>(null);

  const channelColor = (key: CurveChannel): string => {
    switch (key) {
      case 'red': return '#dc4644';
      case 'green': return '#5fc25f';
      case 'blue': return '#5082f0';
      default: return '#dedede';
    }
  };

  const toPixel = (point: ToneCurvePoint) => ({
    x: PADDING + point.x * PLOT,
    y: PADDING + (1 - point.y) * PLOT,
  });

  const fromEvent = (event: PointerEvent): ToneCurvePoint => {
    const rect = svg.getBoundingClientRect();
    const x = (event.clientX - rect.left - PADDING) / PLOT;
    const y = 1 - (event.clientY - rect.top - PADDING) / PLOT;
    return {
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
    };
  };

  const curvePath = $derived.by(() => {
    if (points.length < 2) return '';
    const sorted = [...points].sort((a, b) => a.x - b.x);
    const spline = new CubicSpline(sorted);
    const segments: string[] = [];

    for (let i = 0; i <= PLOT; i++) {
      const t = i / PLOT;
      const y = spline.interpolate(t);
      const clamped = y < 0 ? 0 : y > 1 ? 1 : y;
      const px = PADDING + t * PLOT;
      const py = PADDING + (1 - clamped) * PLOT;
      segments.push(`${i === 0 ? 'M' : 'L'}${px.toFixed(2)},${py.toFixed(2)}`);
    }

    return segments.join(' ');
  });

  const updatePoint = (index: number, next: ToneCurvePoint) => {
    const list = points.slice();
    const isEndpoint = index === 0 || index === list.length - 1;

    if (isEndpoint) {
      list[index] = { x: list[index].x, y: next.y };
    } else {
      const left = list[index - 1]?.x ?? 0;
      const right = list[index + 1]?.x ?? 1;
      list[index] = {
        x: Math.max(left + 1e-3, Math.min(right - 1e-3, next.x)),
        y: next.y,
      };
    }

    editor.adjustments.curves = {
      ...editor.adjustments.curves,
      [channel]: list,
    };
    editor.requestRender();
  };

  const onPointerDown = (index: number) => (event: PointerEvent) => {
    event.stopPropagation();
    dragIndex = index;
    (event.currentTarget as SVGElement).setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (dragIndex === null) return;
    updatePoint(dragIndex, fromEvent(event));
  };

  const onPointerUp = () => {
    dragIndex = null;
  };

  const onBackgroundClick = (event: PointerEvent) => {
    if (dragIndex !== null) return;
    const pt = fromEvent(event);

    const list = [...points, pt].sort((a, b) => a.x - b.x);
    editor.adjustments.curves = {
      ...editor.adjustments.curves,
      [channel]: list,
    };
    editor.requestRender('Add curve point');
  };

  const onPointDoubleClick = (index: number) => (event: MouseEvent) => {
    if (index === 0 || index === points.length - 1) return;
    event.stopPropagation();
    const list = points.slice();
    list.splice(index, 1);
    editor.adjustments.curves = {
      ...editor.adjustments.curves,
      [channel]: list,
    };
    editor.requestRender('Remove curve point');
  };

  const reset = () => {
    editor.adjustments.curves = {
      ...editor.adjustments.curves,
      [channel]: [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ],
    };
    editor.requestRender('Reset curve');
  };
</script>

<div class="curve">
  <div class="channels">
    {#each ['rgb', 'red', 'green', 'blue'] as const as key}
      <button
        class="ghost channel"
        class:active={channel === key}
        style:color={channel === key ? channelColor(key) : ''}
        onclick={() => (channel = key)}
      >
        {key.toUpperCase()}
      </button>
    {/each}
    <button class="ghost reset" onclick={reset}>Reset</button>
  </div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <svg
    bind:this={svg}
    width={SIZE}
    height={SIZE}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerUp}
    onpointerdown={onBackgroundClick}
  >
    <rect x={PADDING} y={PADDING} width={PLOT} height={PLOT} class="grid-bg" />

    {#each Array(5) as _, i}
      <line
        x1={PADDING + (i + 1) * PLOT / 5}
        y1={PADDING}
        x2={PADDING + (i + 1) * PLOT / 5}
        y2={PADDING + PLOT}
        class="grid"
      />
      <line
        x1={PADDING}
        y1={PADDING + (i + 1) * PLOT / 5}
        x2={PADDING + PLOT}
        y2={PADDING + (i + 1) * PLOT / 5}
        class="grid"
      />
    {/each}

    <line
      x1={PADDING}
      y1={PADDING + PLOT}
      x2={PADDING + PLOT}
      y2={PADDING}
      class="diagonal"
    />

    <path d={curvePath} stroke={channelColor(channel)} fill="none" stroke-width="1.6" />

    {#each points as point, index}
      {@const px = toPixel(point)}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <circle
        cx={px.x}
        cy={px.y}
        r={5}
        fill={channelColor(channel)}
        stroke="#000"
        stroke-width="1"
        class="handle"
        onpointerdown={onPointerDown(index)}
        ondblclick={onPointDoubleClick(index)}
      />
    {/each}
  </svg>
</div>

<style>
  .curve {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .channels {
    display: flex;
    gap: 2px;
    padding: 2px;
    background: var(--bg-input);
    border-radius: 6px;
  }

  .channel {
    flex: 1;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 4px;
    color: var(--text-muted);
  }

  .channel.active {
    background: var(--bg-elevated);
  }

  .reset {
    flex: 0;
    font-size: 10px;
    padding: 4px 8px;
  }

  svg {
    width: 100%;
    height: auto;
    background: var(--bg-input);
    border-radius: var(--radius);
    border: 1px solid var(--border-soft);
    cursor: crosshair;
    touch-action: none;
  }

  .grid-bg {
    fill: transparent;
  }

  .grid {
    stroke: rgba(255, 255, 255, 0.05);
    stroke-width: 1;
  }

  .diagonal {
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 1;
    stroke-dasharray: 2 3;
  }

  .handle {
    cursor: grab;
  }

  .handle:active {
    cursor: grabbing;
  }
</style>
