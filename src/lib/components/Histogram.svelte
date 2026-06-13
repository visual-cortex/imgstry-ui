<script lang="ts">
  import { editor } from '../editor/editor.svelte';

  const WIDTH = 200;
  const HEIGHT = 80;

  let canvas: HTMLCanvasElement;

  const drawChannel = (
    context: CanvasRenderingContext2D,
    bins: number[],
    color: string,
    peak: number,
  ) => {
    context.beginPath();
    context.moveTo(0, HEIGHT);

    for (let i = 0; i < bins.length; i++) {
      const x = (i / (bins.length - 1)) * WIDTH;
      const y = HEIGHT - (bins[i] / peak) * HEIGHT;
      context.lineTo(x, y);
    }

    context.lineTo(WIDTH, HEIGHT);
    context.closePath();
    context.fillStyle = color;
    context.fill();
  };

  $effect(() => {
    const histogram = editor.histogram;
    const context = canvas?.getContext('2d');

    if (!context) {
      return;
    }

    context.clearRect(0, 0, WIDTH, HEIGHT);

    if (!histogram) {
      return;
    }

    const peak = Math.max(
      ...histogram.channel.red,
      ...histogram.channel.green,
      ...histogram.channel.blue,
      1e-6,
    );

    context.globalCompositeOperation = 'screen';
    drawChannel(context, histogram.channel.red, 'rgba(220, 70, 60, 0.5)', peak);
    drawChannel(context, histogram.channel.green, 'rgba(90, 200, 90, 0.5)', peak);
    drawChannel(context, histogram.channel.blue, 'rgba(80, 130, 240, 0.5)', peak);
    context.globalCompositeOperation = 'source-over';
  });
</script>

<div class="histogram">
  <canvas bind:this={canvas} width={WIDTH} height={HEIGHT}></canvas>
</div>

<style>
  .histogram {
    display: flex;
    flex-direction: column;
  }

  canvas {
    width: 100%;
    height: auto;
    background: radial-gradient(ellipse at center, #1c1c20 0%, #131316 100%);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-soft);
  }
</style>
