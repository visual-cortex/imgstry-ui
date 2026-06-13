<script lang="ts">
  import type { Adjustments } from '../editor/adjustments';
  import { editor } from '../editor/editor.svelte';
  import { mobile, MOBILE_SLIDERS, type MobileSliderSpec } from '../editor/mobile.svelte';
  import Slider from './Slider.svelte';

  const disabled = $derived(!editor.hasImage);
  const spec = $derived<MobileSliderSpec>(
    MOBILE_SLIDERS.find((s) => s.key === mobile.activeAdjustment) ?? MOBILE_SLIDERS[0],
  );
  const value = $derived(editor.adjustments[spec.key] as number);

  const set = (next: number) => {
    (editor.adjustments[spec.key] as Adjustments[typeof spec.key]) = next as Adjustments[typeof spec.key];
    editor.requestRender();
  };

  const reset = () => {
    set(0);
  };
</script>

<section class="strip" class:disabled>
  <div class="chips scroll">
    {#each MOBILE_SLIDERS as item}
      <button
        class="chip"
        class:active={mobile.activeAdjustment === item.key}
        class:dirty={editor.adjustments[item.key] !== 0}
        {disabled}
        onclick={() => (mobile.activeAdjustment = item.key)}
      >
        {item.label}
      </button>
    {/each}
  </div>

  <div class="slider-row">
    <Slider
      label={spec.label}
      min={spec.min}
      max={spec.max}
      step={spec.step ?? 1}
      suffix={spec.suffix ?? ''}
      bipolar={spec.bipolar ?? true}
      value={value}
      {disabled}
      onchange={set}
    />
    <button class="ghost reset" {disabled} onclick={reset}>Reset</button>
  </div>
</section>

<style>
  .strip {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 10px;
    background: linear-gradient(to top, var(--bg-rail), color-mix(in srgb, var(--bg-rail) 92%, transparent));
    border-top: 1px solid var(--border);
    backdrop-filter: blur(8px);
  }

  .strip.disabled {
    opacity: .45;
    pointer-events: none;
  }

  .chips {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 2px;
    scrollbar-width: none;
  }

  .chips::-webkit-scrollbar {
    display: none;
  }

  .chip {
    flex-shrink: 0;
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .3px;
    color: var(--text-dim);
    background: var(--bg-elevated);
    border: 1px solid transparent;
    border-radius: 999px;
    cursor: pointer;
    min-height: 32px;
  }

  .chip.dirty {
    color: var(--accent);
  }

  .chip.active {
    color: var(--text);
    background: var(--accent-soft);
    border-color: var(--accent);
  }

  .slider-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    align-items: end;
  }

  .reset {
    font-size: 11px;
    padding: 6px 10px;
    align-self: end;
    min-height: 32px;
  }
</style>
