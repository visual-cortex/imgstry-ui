import { Cmyk, Hex, Hsv, Rgb } from 'imgstry';

export type ColorMode = 'hex' | 'rgb' | 'hsv' | 'cmyk';

export interface ColorState {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

const round = (value: number, digits = 0): number => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

/**
 * Recompute every color-space representation from a canonical Rgb seed.
 */
export const stateFromRgb = (rgb: Rgb): ColorState => {
  const hex = rgb.toHex().value;
  const hsv = rgb.toHsv();
  const cmyk = rgb.toCmyk();

  return {
    hex,
    rgb: { r: rgb.r, g: rgb.g, b: rgb.b },
    hsv: { h: hsv.h, s: round(hsv.s * 100), v: round(hsv.v * 100) },
    cmyk: {
      c: round(cmyk.c * 100),
      m: round(cmyk.m * 100),
      y: round(cmyk.y * 100),
      k: round(cmyk.k * 100),
    },
  };
};

export const stateFromHex = (value: string): ColorState =>
  stateFromRgb(new Hex(value).toRgb());

export const stateFromHsv = (
  h: number,
  s: number,
  v: number,
): ColorState =>
  stateFromRgb(new Hsv({ h, s: s / 100, v: v / 100 }).toRgb());

export const stateFromCmyk = (
  c: number,
  m: number,
  y: number,
  k: number,
): ColorState =>
  stateFromRgb(new Cmyk({
    c: c / 100,
    m: m / 100,
    y: y / 100,
    k: k / 100,
  }).toRgb());

export const stateFromRgbChannels = (
  r: number,
  g: number,
  b: number,
): ColorState => stateFromRgb(new Rgb({ r, g, b }));

const HEX_FULL = /^#?[0-9a-f]{6}$/i;
const HEX_SHORT = /^#?[0-9a-f]{3}$/i;

export const normalizeHexInput = (value: string): string | null => {
  const trimmed = value.trim();

  if (HEX_FULL.test(trimmed)) {
    return trimmed.startsWith('#') ? trimmed.toUpperCase() : `#${trimmed.toUpperCase()}`;
  }

  if (HEX_SHORT.test(trimmed)) {
    const stripped = trimmed.replace('#', '');
    const expanded = stripped
      .split('')
      .map((c) => c + c)
      .join('');
    return `#${expanded.toUpperCase()}`;
  }

  return null;
};
