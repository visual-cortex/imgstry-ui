import type { Adjustments } from './adjustments';

export type MobilePane = 'adjust' | 'curve' | 'tools' | 'history';

export interface MobileSliderSpec {
  key: keyof Adjustments;
  label: string;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  bipolar?: boolean;
}

export const MOBILE_SLIDERS: readonly MobileSliderSpec[] = [
  { key: 'exposure',       label: 'Exposure',   min: -3,   max: 3,   step: .1 },
  { key: 'contrast',       label: 'Contrast',   min: -100, max: 100 },
  { key: 'highlights',     label: 'Highlights', min: -100, max: 100 },
  { key: 'shadows',        label: 'Shadows',    min: -100, max: 100 },
  { key: 'whites',         label: 'Whites',     min: -100, max: 100 },
  { key: 'blacks',         label: 'Blacks',     min: -100, max: 100 },
  { key: 'temperature',    label: 'Temp',       min: -100, max: 100 },
  { key: 'tintShift',      label: 'Tint',       min: -100, max: 100 },
  { key: 'vibrance',       label: 'Vibrance',   min: -100, max: 100 },
  { key: 'saturation',     label: 'Saturation', min: -100, max: 100 },
  { key: 'texture',        label: 'Texture',    min: -100, max: 100 },
  { key: 'clarity',        label: 'Clarity',    min: -100, max: 100 },
  { key: 'hue',            label: 'Hue',        min: -180, max: 180, suffix: '°' },
  { key: 'sepia',          label: 'Sepia',      min: 0,    max: 100, bipolar: false },
  { key: 'sharpenAmount',  label: 'Sharpen',    min: 0,    max: 100, bipolar: false },
  { key: 'noiseReduction', label: 'Denoise',    min: 0,    max: 100, bipolar: false },
  { key: 'grain',          label: 'Grain',      min: 0,    max: 100, bipolar: false },
  { key: 'vignetteAmount', label: 'Vignette',   min: -100, max: 100 },
];

class MobileState {
  public open = $state(false);
  public activePane = $state<MobilePane>('adjust');
  public activeAdjustment = $state<keyof Adjustments>('exposure');
}

export const mobile = new MobileState();
