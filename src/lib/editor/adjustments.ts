export interface ToneCurvePoint {
  x: number;
  y: number;
}

export interface ToneCurves {
  rgb: ToneCurvePoint[];
  red: ToneCurvePoint[];
  green: ToneCurvePoint[];
  blue: ToneCurvePoint[];
}

export interface Adjustments {
  // basic
  temperature: number;
  tintShift: number;
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  // presence
  texture: number;
  clarity: number;
  vibrance: number;
  saturation: number;
  // detail
  sharpenAmount: number;
  noiseReduction: number;
  // effects
  vignetteAmount: number;
  vignetteMidpoint: number;
  vignetteFeather: number;
  grain: number;
  // creative
  hue: number;
  sepia: number;
  blackAndWhite: boolean;
  invert: boolean;
  tint: string | null;
  splitShadows: string | null;
  splitHighlights: string | null;
  splitBalance: number;
  splitAmount: number;
  // calibration
  gamma: number;
  // tone curves
  curves: ToneCurves;
}

const defaultCurve = (): ToneCurvePoint[] => [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
];

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  temperature: 0,
  tintShift: 0,
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  texture: 0,
  clarity: 0,
  vibrance: 0,
  saturation: 0,
  sharpenAmount: 0,
  noiseReduction: 0,
  vignetteAmount: 0,
  vignetteMidpoint: 50,
  vignetteFeather: 50,
  grain: 0,
  hue: 0,
  sepia: 0,
  blackAndWhite: false,
  invert: false,
  tint: null,
  splitShadows: null,
  splitHighlights: null,
  splitBalance: 0,
  splitAmount: 50,
  gamma: 0,
  curves: {
    rgb: defaultCurve(),
    red: defaultCurve(),
    green: defaultCurve(),
    blue: defaultCurve(),
  },
};

const numericKeys: Array<keyof Adjustments> = [
  'temperature', 'tintShift', 'exposure', 'contrast',
  'highlights', 'shadows', 'whites', 'blacks',
  'texture', 'clarity', 'vibrance', 'saturation',
  'sharpenAmount', 'noiseReduction',
  'vignetteAmount', 'grain', 'hue', 'sepia', 'gamma',
];

export const isPristine = (adjustments: Adjustments): boolean => {
  for (const key of numericKeys) {
    if (adjustments[key] !== DEFAULT_ADJUSTMENTS[key]) {
      return false;
    }
  }

  if (adjustments.blackAndWhite || adjustments.invert) {
    return false;
  }

  if (adjustments.tint || adjustments.splitShadows || adjustments.splitHighlights) {
    return false;
  }

  for (const channel of ['rgb', 'red', 'green', 'blue'] as const) {
    const points = adjustments.curves[channel];
    if (points.length !== 2) {
      return false;
    }
    if (points[0].x !== 0 || points[0].y !== 0 || points[1].x !== 1 || points[1].y !== 1) {
      return false;
    }
  }

  return true;
};

/**
 * Unsharp-mask kernel; amount in [0, 100].
 */
export const sharpenKernel = (amount: number): number[][] => {
  const k = amount / 100;
  return [
    [0, -k, 0],
    [-k, 1 + 4 * k, -k],
    [0, -k, 0],
  ];
};

/**
 * Maps the noise reduction slider [0, 100] to a gaussian kernel size and sigma.
 */
export const noiseReductionParams = (amount: number): { size: number; sigma: number } => ({
  size: Math.min(9, 3 + 2 * Math.floor(amount / 30)),
  sigma: Math.max(amount / 25, .5),
});
