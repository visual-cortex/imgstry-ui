import type { Adjustments } from './adjustments';

export type PresetGroup = 'Cinematic' | 'Vintage' | 'B&W' | 'Modern' | 'Instagram';

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
  Instagram: 'var(--color-tag-instagram)',
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

  // Instagram-flavoured looks. Each is a per-channel transfer curve
  // measured from an authoritative reference render (CSSgram for the
  // standard set; the source filter app for Lark / Calderon / Mayfair),
  // reproduced through the engine curve + vignette ops to within a few
  // levels/channel against those references.
  {
    id: 'ig-clarendon',
    name: 'Clarendon',
    group: 'Instagram',
    patch: {
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        red: [{ x: 0, y: 0 }, { x: 0.1255, y: 0.042 }, { x: 0.251, y: 0.2081 }, { x: 0.3765, y: 0.3672 }, { x: 0.502, y: 0.5827 }, { x: 0.6275, y: 0.7305 }, { x: 0.7529, y: 0.8865 }, { x: 0.8784, y: 0.9996 }, { x: 1, y: 1 }],
        green: [{ x: 0, y: 0 }, { x: 0.1255, y: 0.0582 }, { x: 0.251, y: 0.1993 }, { x: 0.3765, y: 0.3807 }, { x: 0.502, y: 0.5401 }, { x: 0.6275, y: 0.6785 }, { x: 0.7529, y: 0.8178 }, { x: 0.8784, y: 0.962 }, { x: 1, y: 1 }],
        blue: [{ x: 0, y: 0 }, { x: 0.1255, y: 0.014 }, { x: 0.251, y: 0.1149 }, { x: 0.3765, y: 0.2952 }, { x: 0.502, y: 0.4606 }, { x: 0.6275, y: 0.648 }, { x: 0.7529, y: 0.7582 }, { x: 0.8784, y: 0.7582 }, { x: 1, y: 0.7582 }],
      },
    },
  },
  {
    id: 'ig-gingham',
    name: 'Gingham',
    group: 'Instagram',
    patch: {
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        red: [{ x: 0, y: 0.0034 }, { x: 0.1255, y: 0.3233 }, { x: 0.251, y: 0.4821 }, { x: 0.3765, y: 0.6028 }, { x: 0.502, y: 0.7106 }, { x: 0.6275, y: 0.8128 }, { x: 0.7529, y: 0.9044 }, { x: 0.8784, y: 0.9822 }, { x: 1, y: 1 }],
        green: [{ x: 0, y: 0.0008 }, { x: 0.1255, y: 0.309 }, { x: 0.251, y: 0.4506 }, { x: 0.3765, y: 0.5718 }, { x: 0.502, y: 0.6734 }, { x: 0.6275, y: 0.7692 }, { x: 0.7529, y: 0.8593 }, { x: 0.8784, y: 0.944 }, { x: 1, y: 0.9709 }],
        blue: [{ x: 0, y: 0.0247 }, { x: 0.1255, y: 0.3933 }, { x: 0.251, y: 0.5291 }, { x: 0.3765, y: 0.6381 }, { x: 0.502, y: 0.7371 }, { x: 0.6275, y: 0.812 }, { x: 0.7529, y: 0.8793 }, { x: 0.8784, y: 0.8793 }, { x: 1, y: 0.8793 }],
      },
    },
  },
  {
    id: 'ig-lark',
    name: 'Lark',
    group: 'Instagram',
    patch: {
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        red: [{ x: 0, y: 0.0772 }, { x: 0.1255, y: 0.2012 }, { x: 0.251, y: 0.3312 }, { x: 0.3765, y: 0.4587 }, { x: 0.502, y: 0.6014 }, { x: 0.6275, y: 0.726 }, { x: 0.7529, y: 0.8528 }, { x: 0.8784, y: 0.9741 }, { x: 1, y: 1 }],
        green: [{ x: 0, y: 0.0823 }, { x: 0.1255, y: 0.2139 }, { x: 0.251, y: 0.3347 }, { x: 0.3765, y: 0.4659 }, { x: 0.502, y: 0.5937 }, { x: 0.6275, y: 0.7236 }, { x: 0.7529, y: 0.8549 }, { x: 0.8784, y: 0.9873 }, { x: 1, y: 1 }],
        blue: [{ x: 0, y: 0.075 }, { x: 0.1255, y: 0.1937 }, { x: 0.251, y: 0.3161 }, { x: 0.3765, y: 0.4519 }, { x: 0.502, y: 0.5793 }, { x: 0.6275, y: 0.7237 }, { x: 0.7529, y: 0.8357 }, { x: 0.8784, y: 0.8357 }, { x: 1, y: 0.8357 }],
      },
    },
  },
  {
    id: 'ig-calderon',
    name: 'Calderon',
    group: 'Instagram',
    patch: {
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        red: [{ x: 0, y: 0.0059 }, { x: 0.1255, y: 0.158 }, { x: 0.251, y: 0.3175 }, { x: 0.3765, y: 0.4739 }, { x: 0.502, y: 0.6565 }, { x: 0.6275, y: 0.809 }, { x: 0.7529, y: 0.9643 }, { x: 0.8784, y: 1 }, { x: 1, y: 1 }],
        green: [{ x: 0, y: 0.0076 }, { x: 0.1255, y: 0.1638 }, { x: 0.251, y: 0.3025 }, { x: 0.3765, y: 0.4647 }, { x: 0.502, y: 0.6193 }, { x: 0.6275, y: 0.7732 }, { x: 0.7529, y: 0.9299 }, { x: 0.8784, y: 1 }, { x: 1, y: 1 }],
        blue: [{ x: 0, y: 0.0015 }, { x: 0.1255, y: 0.1265 }, { x: 0.251, y: 0.2687 }, { x: 0.3765, y: 0.425 }, { x: 0.502, y: 0.5817 }, { x: 0.6275, y: 0.7486 }, { x: 0.7529, y: 0.8902 }, { x: 0.8784, y: 0.8902 }, { x: 1, y: 0.8902 }],
      },
    },
  },
  {
    id: 'ig-lofi',
    name: 'Lo-Fi',
    group: 'Instagram',
    patch: {
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        red: [{ x: 0, y: 0 }, { x: 0.1255, y: 0 }, { x: 0.251, y: 0.136 }, { x: 0.3765, y: 0.3298 }, { x: 0.502, y: 0.5344 }, { x: 0.6275, y: 0.7244 }, { x: 0.7529, y: 0.9117 }, { x: 0.8784, y: 1 }, { x: 1, y: 1 }],
        green: [{ x: 0, y: 0 }, { x: 0.1255, y: 0 }, { x: 0.251, y: 0.1191 }, { x: 0.3765, y: 0.3113 }, { x: 0.502, y: 0.4983 }, { x: 0.6275, y: 0.6869 }, { x: 0.7529, y: 0.8764 }, { x: 0.8784, y: 1 }, { x: 1, y: 1 }],
        blue: [{ x: 0, y: 0 }, { x: 0.1255, y: 0 }, { x: 0.251, y: 0.083 }, { x: 0.3765, y: 0.2722 }, { x: 0.502, y: 0.4609 }, { x: 0.6275, y: 0.6549 }, { x: 0.7529, y: 0.6885 }, { x: 0.8784, y: 0.6885 }, { x: 1, y: 0.6885 }],
      },
      vignetteAmount: -10, vignetteMidpoint: 60, vignetteFeather: 85,
    },
  },
  {
    id: 'ig-nashville',
    name: 'Nashville',
    group: 'Instagram',
    patch: {
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        red: [{ x: 0, y: 0 }, { x: 0.1255, y: 0.0657 }, { x: 0.251, y: 0.2302 }, { x: 0.3765, y: 0.3974 }, { x: 0.502, y: 0.5501 }, { x: 0.6275, y: 0.7185 }, { x: 0.7529, y: 0.8861 }, { x: 0.8784, y: 0.9843 }, { x: 1, y: 0.9843 }],
        green: [{ x: 0, y: 0.1098 }, { x: 0.1255, y: 0.1451 }, { x: 0.251, y: 0.2483 }, { x: 0.3765, y: 0.3878 }, { x: 0.502, y: 0.5538 }, { x: 0.6275, y: 0.7021 }, { x: 0.7529, y: 0.7761 }, { x: 0.8784, y: 0.8275 }, { x: 1, y: 0.8275 }],
        blue: [{ x: 0, y: 0.2353 }, { x: 0.1255, y: 0.2674 }, { x: 0.251, y: 0.3595 }, { x: 0.3765, y: 0.4525 }, { x: 0.502, y: 0.5457 }, { x: 0.6275, y: 0.6314 }, { x: 0.7529, y: 0.6954 }, { x: 0.8784, y: 0.6954 }, { x: 1, y: 0.6954 }],
      },
    },
  },
  {
    id: 'ig-valencia',
    name: 'Valencia',
    group: 'Instagram',
    patch: {
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        red: [{ x: 0, y: 0.1137 }, { x: 0.1255, y: 0.1967 }, { x: 0.251, y: 0.3096 }, { x: 0.3765, y: 0.4239 }, { x: 0.502, y: 0.5261 }, { x: 0.6275, y: 0.6424 }, { x: 0.7529, y: 0.7576 }, { x: 0.8784, y: 0.8767 }, { x: 1, y: 0.8863 }],
        green: [{ x: 0, y: 0.0078 }, { x: 0.1255, y: 0.1078 }, { x: 0.251, y: 0.2623 }, { x: 0.3765, y: 0.4041 }, { x: 0.502, y: 0.5518 }, { x: 0.6275, y: 0.6986 }, { x: 0.7529, y: 0.845 }, { x: 0.8784, y: 0.9882 }, { x: 1, y: 0.9961 }],
        blue: [{ x: 0, y: 0.1148 }, { x: 0.1255, y: 0.2033 }, { x: 0.251, y: 0.3206 }, { x: 0.3765, y: 0.4329 }, { x: 0.502, y: 0.547 }, { x: 0.6275, y: 0.6546 }, { x: 0.7529, y: 0.7486 }, { x: 0.8784, y: 0.7486 }, { x: 1, y: 0.7486 }],
      },
    },
  },
  {
    id: 'ig-xpro',
    name: 'X-Pro II',
    group: 'Instagram',
    patch: {
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        red: [{ x: 0, y: 0 }, { x: 0.1255, y: 0.044 }, { x: 0.251, y: 0.1648 }, { x: 0.3765, y: 0.2998 }, { x: 0.502, y: 0.4127 }, { x: 0.6275, y: 0.5606 }, { x: 0.7529, y: 0.7166 }, { x: 0.8784, y: 0.8845 }, { x: 1, y: 0.9999 }],
        green: [{ x: 0, y: 0 }, { x: 0.1255, y: 0.0321 }, { x: 0.251, y: 0.2066 }, { x: 0.3765, y: 0.339 }, { x: 0.502, y: 0.494 }, { x: 0.6275, y: 0.6387 }, { x: 0.7529, y: 0.7828 }, { x: 0.8784, y: 0.9224 }, { x: 1, y: 0.9468 }],
        blue: [{ x: 0, y: 0 }, { x: 0.1255, y: 0.0564 }, { x: 0.251, y: 0.2334 }, { x: 0.3765, y: 0.3712 }, { x: 0.502, y: 0.5093 }, { x: 0.6275, y: 0.6381 }, { x: 0.7529, y: 0.6678 }, { x: 0.8784, y: 0.6678 }, { x: 1, y: 0.6678 }],
      },
      vignetteAmount: -55, vignetteMidpoint: 60, vignetteFeather: 70,
    },
  },
  {
    id: 'ig-hudson',
    name: 'Hudson',
    group: 'Instagram',
    patch: {
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        red: [{ x: 0, y: 0.0383 }, { x: 0.1255, y: 0.1379 }, { x: 0.251, y: 0.2472 }, { x: 0.3765, y: 0.3529 }, { x: 0.502, y: 0.4646 }, { x: 0.6275, y: 0.5667 }, { x: 0.7529, y: 0.679 }, { x: 0.8784, y: 0.748 }, { x: 1, y: 0.7369 }],
        green: [{ x: 0, y: 0.039 }, { x: 0.1255, y: 0.1416 }, { x: 0.251, y: 0.2371 }, { x: 0.3765, y: 0.3541 }, { x: 0.502, y: 0.4533 }, { x: 0.6275, y: 0.5698 }, { x: 0.7529, y: 0.6774 }, { x: 0.8784, y: 0.7631 }, { x: 1, y: 0.7569 }],
        blue: [{ x: 0, y: 0.0398 }, { x: 0.1255, y: 0.1452 }, { x: 0.251, y: 0.2594 }, { x: 0.3765, y: 0.388 }, { x: 0.502, y: 0.5143 }, { x: 0.6275, y: 0.6773 }, { x: 0.7529, y: 0.6969 }, { x: 0.8784, y: 0.6969 }, { x: 1, y: 0.6969 }],
      },
      vignetteAmount: -15, vignetteMidpoint: 40, vignetteFeather: 85,
    },
  },
  {
    id: 'ig-1977',
    name: '1977',
    group: 'Instagram',
    patch: {
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        red: [{ x: 0, y: 0.2863 }, { x: 0.1255, y: 0.3499 }, { x: 0.251, y: 0.4682 }, { x: 0.3765, y: 0.5817 }, { x: 0.502, y: 0.7303 }, { x: 0.6275, y: 0.8367 }, { x: 0.7529, y: 0.9484 }, { x: 0.8784, y: 1 }, { x: 1, y: 1 }],
        green: [{ x: 0, y: 0.1255 }, { x: 0.1255, y: 0.2114 }, { x: 0.251, y: 0.3281 }, { x: 0.3765, y: 0.4727 }, { x: 0.502, y: 0.602 }, { x: 0.6275, y: 0.7354 }, { x: 0.7529, y: 0.8708 }, { x: 0.8784, y: 1 }, { x: 1, y: 1 }],
        blue: [{ x: 0, y: 0.2196 }, { x: 0.1255, y: 0.2494 }, { x: 0.251, y: 0.3463 }, { x: 0.3765, y: 0.4682 }, { x: 0.502, y: 0.5821 }, { x: 0.6275, y: 0.7228 }, { x: 0.7529, y: 0.8327 }, { x: 0.8784, y: 0.8327 }, { x: 1, y: 0.8327 }],
      },
    },
  },
  {
    id: 'ig-mayfair',
    name: 'Mayfair',
    group: 'Instagram',
    patch: {
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        red: [{ x: 0, y: 0.0475 }, { x: 0.1255, y: 0.1547 }, { x: 0.251, y: 0.2868 }, { x: 0.3765, y: 0.4093 }, { x: 0.502, y: 0.5357 }, { x: 0.6275, y: 0.6492 }, { x: 0.7529, y: 0.7699 }, { x: 0.8784, y: 0.8751 }, { x: 1, y: 0.9703 }],
        green: [{ x: 0, y: 0.0229 }, { x: 0.1255, y: 0.1379 }, { x: 0.251, y: 0.2476 }, { x: 0.3765, y: 0.3609 }, { x: 0.502, y: 0.4752 }, { x: 0.6275, y: 0.5974 }, { x: 0.7529, y: 0.7051 }, { x: 0.8784, y: 0.8494 }, { x: 1, y: 0.8756 }],
        blue: [{ x: 0, y: 0.0103 }, { x: 0.1255, y: 0.1087 }, { x: 0.251, y: 0.2067 }, { x: 0.3765, y: 0.3239 }, { x: 0.502, y: 0.4383 }, { x: 0.6275, y: 0.5804 }, { x: 0.7529, y: 0.6022 }, { x: 0.8784, y: 0.6022 }, { x: 1, y: 0.6022 }],
      },
      vignetteAmount: -30, vignetteMidpoint: 40, vignetteFeather: 85,
    },
  },
  {
    id: 'ig-inkwell',
    name: 'Inkwell',
    group: 'Instagram',
    patch: {
      saturation: -100,
      curves: {
        rgb: [{ x: 0, y: 0 }, { x: 0.1255, y: 0.1043 }, { x: 0.251, y: 0.2716 }, { x: 0.3765, y: 0.4318 }, { x: 0.502, y: 0.5903 }, { x: 0.6275, y: 0.7509 }, { x: 0.7529, y: 0.9006 }, { x: 0.8784, y: 0.9829 }, { x: 1, y: 0.9889 }],
        red: [{ x: 0, y: 0 }, { x: 0.1255, y: 0.1043 }, { x: 0.251, y: 0.2716 }, { x: 0.3765, y: 0.4318 }, { x: 0.502, y: 0.5903 }, { x: 0.6275, y: 0.7509 }, { x: 0.7529, y: 0.9006 }, { x: 0.8784, y: 0.9829 }, { x: 1, y: 0.9889 }],
        green: [{ x: 0, y: 0 }, { x: 0.1255, y: 0.1043 }, { x: 0.251, y: 0.2716 }, { x: 0.3765, y: 0.4318 }, { x: 0.502, y: 0.5903 }, { x: 0.6275, y: 0.7509 }, { x: 0.7529, y: 0.9006 }, { x: 0.8784, y: 0.9829 }, { x: 1, y: 0.9889 }],
        blue: [{ x: 0, y: 0 }, { x: 0.1255, y: 0.1043 }, { x: 0.251, y: 0.2716 }, { x: 0.3765, y: 0.4318 }, { x: 0.502, y: 0.5903 }, { x: 0.6275, y: 0.7509 }, { x: 0.7529, y: 0.9006 }, { x: 0.8784, y: 0.9829 }, { x: 1, y: 0.9889 }],
      },
    },
  },
];
