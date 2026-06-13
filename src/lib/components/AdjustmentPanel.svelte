<script lang="ts">
  import type { Adjustments } from '../editor/adjustments';
  import { editor } from '../editor/editor.svelte';
  import ColorPicker from './ColorPicker.svelte';
  import Slider from './Slider.svelte';

  const set = <K extends keyof Adjustments>(key: K) =>
    (value: Adjustments[K]) => {
      editor.adjustments[key] = value;
      editor.requestRender();
    };

  const disabled = $derived(!editor.hasImage);
</script>

<div class="panel">
  <section>
    <h2>Light</h2>
    <Slider label="Exposure" min={-100} max={100} value={editor.adjustments.exposure} {disabled} onchange={set('exposure')} />
    <Slider label="Contrast" min={-100} max={100} value={editor.adjustments.contrast} {disabled} onchange={set('contrast')} />
    <Slider label="Gamma" min={-100} max={100} value={editor.adjustments.gamma} {disabled} onchange={set('gamma')} />
  </section>

  <section>
    <h2>Color</h2>
    <Slider label="Saturation" min={-100} max={100} value={editor.adjustments.saturation} {disabled} onchange={set('saturation')} />
    <Slider label="Vibrance" min={-100} max={100} value={editor.adjustments.vibrance} {disabled} onchange={set('vibrance')} />
    <Slider label="Hue" min={-180} max={180} value={editor.adjustments.hue} {disabled} onchange={set('hue')} />
    <Slider label="Sepia" min={0} max={100} value={editor.adjustments.sepia} {disabled} onchange={set('sepia')} />
  </section>

  <section>
    <h2>Detail</h2>
    <Slider label="Sharpen" min={0} max={100} value={editor.adjustments.sharpen} {disabled} onchange={set('sharpen')} />
    <Slider label="Blur" min={0} max={10} value={editor.adjustments.blur} {disabled} onchange={set('blur')} />
    <Slider label="Noise" min={0} max={100} value={editor.adjustments.noise} {disabled} onchange={set('noise')} />
  </section>

  <section>
    <h2>Tint</h2>
    <ColorPicker
      label="Color"
      value={editor.adjustments.tint}
      {disabled}
      onchange={(hex) => set('tint')(hex)}
    />
  </section>

  <section class="toggles">
    <h2>Creative</h2>
    <label>
      <input
        type="checkbox"
        {disabled}
        checked={editor.adjustments.blackAndWhite}
        onchange={(event) => set('blackAndWhite')(event.currentTarget.checked)}
      />
      Black &amp; white
    </label>
    <label>
      <input
        type="checkbox"
        {disabled}
        checked={editor.adjustments.invert}
        onchange={(event) => set('invert')(event.currentTarget.checked)}
      />
      Invert
    </label>
  </section>
</div>

<style>
  .panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }

  h2 {
    margin: 0;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-dim);
  }

  .toggles label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    cursor: pointer;
  }

  .toggles input {
    accent-color: var(--accent);
  }
</style>
