<script lang="ts">
  import type { Adjustments } from '../editor/adjustments';
  import { editor } from '../editor/editor.svelte';
  import ColorPicker from './ColorPicker.svelte';
  import Panel from './Panel.svelte';
  import Slider from './Slider.svelte';
  import ToneCurve from './ToneCurve.svelte';

  const set = <K extends keyof Adjustments>(key: K) =>
    (value: Adjustments[K]) => {
      editor.adjustments[key] = value;
      editor.requestRender();
    };

  const disabled = $derived(!editor.hasImage);
</script>

<aside class="right scroll">
  <Panel title="Basic">
    <div class="subhead">White Balance</div>
    <Slider label="Temp" min={-100} max={100} value={editor.adjustments.temperature} {disabled} onchange={set('temperature')} />
    <Slider label="Tint" min={-100} max={100} value={editor.adjustments.tintShift} {disabled} onchange={set('tintShift')} />

    <div class="subhead">Tone</div>
    <Slider label="Exposure" min={-3} max={3} step={.1} value={editor.adjustments.exposure} {disabled} onchange={set('exposure')} />
    <Slider label="Contrast" min={-100} max={100} value={editor.adjustments.contrast} {disabled} onchange={set('contrast')} />
    <Slider label="Highlights" min={-100} max={100} value={editor.adjustments.highlights} {disabled} onchange={set('highlights')} />
    <Slider label="Shadows" min={-100} max={100} value={editor.adjustments.shadows} {disabled} onchange={set('shadows')} />
    <Slider label="Whites" min={-100} max={100} value={editor.adjustments.whites} {disabled} onchange={set('whites')} />
    <Slider label="Blacks" min={-100} max={100} value={editor.adjustments.blacks} {disabled} onchange={set('blacks')} />

    <div class="subhead">Presence</div>
    <Slider label="Texture" min={-100} max={100} value={editor.adjustments.texture} {disabled} onchange={set('texture')} />
    <Slider label="Clarity" min={-100} max={100} value={editor.adjustments.clarity} {disabled} onchange={set('clarity')} />
    <Slider label="Vibrance" min={-100} max={100} value={editor.adjustments.vibrance} {disabled} onchange={set('vibrance')} />
    <Slider label="Saturation" min={-100} max={100} value={editor.adjustments.saturation} {disabled} onchange={set('saturation')} />
  </Panel>

  <Panel title="Tone Curve" open={false}>
    <ToneCurve />
  </Panel>

  <Panel title="Color" open={false}>
    <Slider label="Hue" min={-180} max={180} value={editor.adjustments.hue} {disabled} onchange={set('hue')} suffix="°" />
    <Slider label="Sepia" min={0} max={100} value={editor.adjustments.sepia} {disabled} onchange={set('sepia')} bipolar={false} />
    <Slider label="Gamma" min={-100} max={100} value={editor.adjustments.gamma} {disabled} onchange={set('gamma')} />

    <div class="subhead">Tint Overlay</div>
    <ColorPicker label="Tint" value={editor.adjustments.tint} {disabled} onchange={(hex) => set('tint')(hex)} />

    <div class="subhead">Toggles</div>
    <div class="toggles">
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
    </div>
  </Panel>

  <Panel title="Color Grading" open={false}>
    <div class="subhead">Shadows</div>
    <ColorPicker label="Shadow Tint" value={editor.adjustments.splitShadows} {disabled} onchange={(hex) => set('splitShadows')(hex)} />
    <div class="subhead">Highlights</div>
    <ColorPicker label="Highlight Tint" value={editor.adjustments.splitHighlights} {disabled} onchange={(hex) => set('splitHighlights')(hex)} />
    <Slider label="Balance" min={-100} max={100} value={editor.adjustments.splitBalance} {disabled} onchange={set('splitBalance')} />
    <Slider label="Amount" min={0} max={100} value={editor.adjustments.splitAmount} {disabled} onchange={set('splitAmount')} bipolar={false} />
  </Panel>

  <Panel title="Detail" open={false}>
    <Slider label="Sharpen" min={0} max={100} value={editor.adjustments.sharpenAmount} {disabled} onchange={set('sharpenAmount')} bipolar={false} />
    <Slider label="Noise Reduction" min={0} max={100} value={editor.adjustments.noiseReduction} {disabled} onchange={set('noiseReduction')} bipolar={false} />
  </Panel>

  <Panel title="Effects" open={false}>
    <div class="subhead">Vignette</div>
    <Slider label="Amount" min={-100} max={100} value={editor.adjustments.vignetteAmount} {disabled} onchange={set('vignetteAmount')} />
    <Slider label="Midpoint" min={0} max={100} value={editor.adjustments.vignetteMidpoint} {disabled} onchange={set('vignetteMidpoint')} bipolar={false} />
    <Slider label="Feather" min={0} max={100} value={editor.adjustments.vignetteFeather} {disabled} onchange={set('vignetteFeather')} bipolar={false} />

    <div class="subhead">Grain</div>
    <Slider label="Amount" min={0} max={100} value={editor.adjustments.grain} {disabled} onchange={set('grain')} bipolar={false} />
  </Panel>
</aside>

<style>
  aside.right {
    background: var(--bg-rail);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
  }

  .subhead {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1.3px;
    margin: 8px 0 -2px;
  }

  .toggles {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .toggles label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    cursor: pointer;
    color: var(--text-dim);
  }

  .toggles input {
    accent-color: var(--accent);
  }
</style>
