export interface Adjustments {
  exposure: number;
  contrast: number;
  gamma: number;
  saturation: number;
  vibrance: number;
  hue: number;
  sepia: number;
  noise: number;
  sharpen: number;
  blur: number;
  blackAndWhite: boolean;
  invert: boolean;
}

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  exposure: 0,
  contrast: 0,
  gamma: 0,
  saturation: 0,
  vibrance: 0,
  hue: 0,
  sepia: 0,
  noise: 0,
  sharpen: 0,
  blur: 0,
  blackAndWhite: false,
  invert: false,
};

export const isPristine = (adjustments: Adjustments): boolean =>
  Object.entries(DEFAULT_ADJUSTMENTS)
    .every(([key, value]) => adjustments[key as keyof Adjustments] === value);

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
 * Maps the blur slider [0, 10] to a gaussian kernel size and sigma.
 */
export const blurParams = (blur: number): { size: number; sigma: number } => ({
  size: Math.min(9, 3 + 2 * Math.floor(blur / 3)),
  sigma: Math.max(blur, .5),
});
