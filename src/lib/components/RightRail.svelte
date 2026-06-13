<script lang="ts">
  import type { Adjustments } from '../editor/adjustments';
  import { editor } from '../editor/editor.svelte';
  import AdjustmentSlider from './AdjustmentSlider.svelte';
  import ColorPicker from './ColorPicker.svelte';
  import Panel from './Panel.svelte';
  import Subhead from './Subhead.svelte';
  import SwitchRow from './SwitchRow.svelte';
  import ToneCurve from './ToneCurve.svelte';

  const disabled = $derived(!editor.hasImage);

  const setColor = <K extends 'tint' | 'splitShadows' | 'splitHighlights'>(key: K) =>
    (value: Adjustments[K]) => {
      editor.adjustments[key] = value;
      editor.requestRender();
    };

  const setBool = <K extends 'blackAndWhite' | 'invert'>(key: K) =>
    (value: boolean) => {
      editor.adjustments[key] = value;
      editor.requestRender();
    };
</script>

<aside class="right scroll">
  <Panel title="Basic">
    <Subhead label="White Balance" />
    <AdjustmentSlider label="Temp"    key="temperature" min={-100} max={100} />
    <AdjustmentSlider label="Tint"    key="tintShift"   min={-100} max={100} />

    <Subhead label="Tone" />
    <AdjustmentSlider label="Exposure"   key="exposure"   min={-3}   max={3}   step={.1} />
    <AdjustmentSlider label="Contrast"   key="contrast"   min={-100} max={100} />
    <AdjustmentSlider label="Highlights" key="highlights" min={-100} max={100} />
    <AdjustmentSlider label="Shadows"    key="shadows"    min={-100} max={100} />
    <AdjustmentSlider label="Whites"     key="whites"     min={-100} max={100} />
    <AdjustmentSlider label="Blacks"     key="blacks"     min={-100} max={100} />

    <Subhead label="Presence" />
    <AdjustmentSlider label="Texture"    key="texture"    min={-100} max={100} />
    <AdjustmentSlider label="Clarity"    key="clarity"    min={-100} max={100} />
    <AdjustmentSlider label="Vibrance"   key="vibrance"   min={-100} max={100} />
    <AdjustmentSlider label="Saturation" key="saturation" min={-100} max={100} />
  </Panel>

  <Panel title="Tone Curve" open={false}>
    <ToneCurve />
  </Panel>

  <Panel title="Color" open={false}>
    <AdjustmentSlider label="Hue"   key="hue"   min={-180} max={180} suffix="°" />
    <AdjustmentSlider label="Sepia" key="sepia" min={0}    max={100} bipolar={false} />
    <AdjustmentSlider label="Gamma" key="gamma" min={-100} max={100} />

    <Subhead label="Tint Overlay" />
    <ColorPicker label="Tint" value={editor.adjustments.tint} {disabled} onchange={setColor('tint')} />

    <Subhead label="Toggles" />
    <SwitchRow label="Black & white" checked={editor.adjustments.blackAndWhite} {disabled} onchange={setBool('blackAndWhite')} />
    <SwitchRow label="Invert"        checked={editor.adjustments.invert}        {disabled} onchange={setBool('invert')} />
  </Panel>

  <Panel title="Color Grading" open={false}>
    <Subhead label="Shadows" />
    <ColorPicker label="Shadow Tint" value={editor.adjustments.splitShadows} {disabled} onchange={setColor('splitShadows')} />
    <Subhead label="Highlights" />
    <ColorPicker label="Highlight Tint" value={editor.adjustments.splitHighlights} {disabled} onchange={setColor('splitHighlights')} />
    <AdjustmentSlider label="Balance" key="splitBalance" min={-100} max={100} />
    <AdjustmentSlider label="Amount"  key="splitAmount"  min={0}    max={100} bipolar={false} />
  </Panel>

  <Panel title="Detail" open={false}>
    <AdjustmentSlider label="Sharpen"         key="sharpenAmount"   min={0} max={100} bipolar={false} />
    <AdjustmentSlider label="Noise Reduction" key="noiseReduction"  min={0} max={100} bipolar={false} />
  </Panel>

  <Panel title="Effects" open={false}>
    <Subhead label="Vignette" />
    <AdjustmentSlider label="Amount"   key="vignetteAmount"   min={-100} max={100} />
    <AdjustmentSlider label="Midpoint" key="vignetteMidpoint" min={0}    max={100} bipolar={false} />
    <AdjustmentSlider label="Feather"  key="vignetteFeather"  min={0}    max={100} bipolar={false} />

    <Subhead label="Grain" />
    <AdjustmentSlider label="Amount" key="grain" min={0} max={100} bipolar={false} />
  </Panel>
</aside>

<style>
  aside.right {
    background: var(--bg-rail);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
  }
</style>
