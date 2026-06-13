import type { Adjustments } from './adjustments';

export type PresetGroup = 'Cinematic' | 'Vintage' | 'B&W' | 'Modern';

export interface Preset {
  id: string;
  name: string;
  group: PresetGroup;
  patch: Partial<Adjustments>;
}

/**
 * Single source of truth for the colored swatch each preset group uses
 * across the desktop rail and the mobile tools sheet.
 */
export const GROUP_HUE: Record<PresetGroup, string> = {
  Cinematic: 'var(--color-tag-cinematic)',
  Vintage:   'var(--color-tag-vintage)',
  Modern:    'var(--color-tag-modern)',
  'B&W':     'var(--color-tag-bw)',
};

export const PRESETS: Preset[] = [
  {
    id: 'cine-teal-orange',
    name: 'Teal & Orange',
    group: 'Cinematic',
    patch: {
      exposure: .2,
      contrast: 15,
      highlights: -20,
      shadows: 25,
      whites: 10,
      blacks: -15,
      vibrance: 20,
      saturation: -10,
      splitShadows: '#2A6F87',
      splitHighlights: '#E0A06A',
      splitAmount: 60,
      splitBalance: 0,
    },
  },
  {
    id: 'cine-nocturne',
    name: 'Nocturne',
    group: 'Cinematic',
    patch: {
      exposure: -.3,
      contrast: 25,
      highlights: -35,
      shadows: -20,
      whites: -15,
      blacks: -25,
      temperature: -15,
      vibrance: -15,
      vignetteAmount: -35,
      vignetteFeather: 70,
    },
  },
  {
    id: 'cine-faded-film',
    name: 'Faded Film',
    group: 'Cinematic',
    patch: {
      exposure: .1,
      contrast: -25,
      highlights: -10,
      shadows: 25,
      whites: -20,
      blacks: 30,
      temperature: 8,
      vibrance: -5,
      curves: {
        rgb: [
          { x: 0, y: .08 },
          { x: 1, y: .92 },
        ],
        red: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        green: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        blue: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      },
    },
  },
  {
    id: 'vintage-kodak',
    name: 'Kodak Gold',
    group: 'Vintage',
    patch: {
      temperature: 18,
      tintShift: 5,
      exposure: .15,
      contrast: 10,
      highlights: -15,
      shadows: 10,
      vibrance: 15,
      saturation: -5,
      grain: 12,
    },
  },
  {
    id: 'vintage-polaroid',
    name: 'Polaroid',
    group: 'Vintage',
    patch: {
      temperature: 10,
      contrast: -15,
      highlights: -20,
      shadows: 30,
      whites: 10,
      vibrance: -10,
      saturation: -15,
      sepia: 15,
      vignetteAmount: -20,
    },
  },
  {
    id: 'modern-vibrant',
    name: 'Vibrant',
    group: 'Modern',
    patch: {
      exposure: .15,
      contrast: 20,
      highlights: -15,
      shadows: 20,
      whites: 5,
      blacks: -10,
      vibrance: 35,
      saturation: 10,
      clarity: 15,
    },
  },
  {
    id: 'modern-clean',
    name: 'Clean Light',
    group: 'Modern',
    patch: {
      exposure: .25,
      contrast: 5,
      highlights: -10,
      shadows: 15,
      whites: 8,
      vibrance: 10,
      sharpenAmount: 25,
    },
  },
  {
    id: 'modern-matte',
    name: 'Matte',
    group: 'Modern',
    patch: {
      contrast: -20,
      highlights: -25,
      shadows: 35,
      whites: -10,
      blacks: 20,
      vibrance: -5,
    },
  },
  {
    id: 'bw-classic',
    name: 'Classic',
    group: 'B&W',
    patch: {
      blackAndWhite: true,
      contrast: 15,
      highlights: -10,
      shadows: 10,
      whites: 5,
      blacks: -5,
    },
  },
  {
    id: 'bw-high-contrast',
    name: 'High Contrast',
    group: 'B&W',
    patch: {
      blackAndWhite: true,
      contrast: 40,
      highlights: -25,
      shadows: -10,
      whites: 20,
      blacks: -30,
      clarity: 25,
    },
  },
  {
    id: 'bw-silver',
    name: 'Silver',
    group: 'B&W',
    patch: {
      blackAndWhite: true,
      contrast: -10,
      highlights: -15,
      shadows: 25,
      vignetteAmount: -15,
    },
  },
];
