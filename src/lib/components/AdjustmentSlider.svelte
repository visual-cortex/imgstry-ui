<script lang="ts" generics="K extends keyof import('../editor/adjustments').Adjustments">
  import type { Adjustments } from '../editor/adjustments';
  import { editor } from '../editor/editor.svelte';
  import Slider from './Slider.svelte';

  type AdjustmentsValue = Adjustments[K];

  interface Props {
    label: string;
    key: K;
    min: number;
    max: number;
    step?: number;
    suffix?: string;
    bipolar?: boolean;
    defaultValue?: number;
  }

  const {
    label,
    key,
    min,
    max,
    step = 1,
    suffix = '',
    bipolar = true,
    defaultValue = 0,
  }: Props = $props();

  const value = $derived(editor.adjustments[key] as number);
  const disabled = $derived(!editor.hasImage);

  const set = (next: number) => {
    (editor.adjustments[key] as AdjustmentsValue) = next as AdjustmentsValue;
    editor.requestRender();
  };
</script>

<Slider
  {label}
  {min}
  {max}
  {step}
  {suffix}
  {bipolar}
  {defaultValue}
  {value}
  {disabled}
  onchange={set}
/>
