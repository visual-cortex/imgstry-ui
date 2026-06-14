import {
  CubicSpline,
  GaussianBlur,
  type HistogramData,
  Imgstry,
  isRawExtension,
  tonemap16to8,
} from 'imgstry';
import {
  type Adjustments,
  DEFAULT_ADJUSTMENTS,
  isPristine,
  noiseReductionParams,
  sharpenKernel,
  type ToneCurvePoint,
} from './adjustments';

const RENDER_DEBOUNCE_MS = 70;

interface HistoryEntry {
  id: string;
  label: string;
  adjustments: Adjustments;
}

interface RawSource {
  rgb16: Uint16Array;
  width: number;
  height: number;
  whiteBalance: [number, number, number];
  blackLevel: number;
  whiteLevel: number;
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const cubicMapping = (points: ToneCurvePoint[]): number[] | null => {
  if (points.length < 2) {
    return null;
  }

  const sorted = [...points].sort((a, b) => a.x - b.x);
  const isIdentity =
    sorted.length === 2 &&
    sorted[0].x === 0 && sorted[0].y === 0 &&
    sorted[1].x === 1 && sorted[1].y === 1;

  if (isIdentity) {
    return null;
  }

  const spline = new CubicSpline(sorted);
  const mapping = new Array<number>(256);

  for (let i = 0; i < 256; i++) {
    const y = spline.interpolate(i / 255);
    const clamped = y < 0 ? 0 : y > 1 ? 1 : y;
    mapping[i] = Math.round(clamped * 255);
  }

  return mapping;
};

class EditorState {
  public adjustments = $state<Adjustments>(clone(DEFAULT_ADJUSTMENTS));
  public hasImage = $state(false);
  public isRendering = $state(false);
  public showOriginal = $state(false);
  public histogram = $state<HistogramData | null>(null);
  public imageName = $state('');
  public history = $state<HistoryEntry[]>([]);
  public dimensions = $state<{ width: number; height: number } | null>(null);
  public rawSourceMode = $state<'sensor' | 'preview' | null>(null);

  private _engine: Imgstry | null = null;
  private _debounce: ReturnType<typeof setTimeout> | null = null;
  private _renderQueue: Promise<void> = Promise.resolve();
  private _renderPending = false;
  private _historyCounter = 0;
  private _rawSource: RawSource | null = null;
  private _lastRebakeExposure: number = Number.NaN;

  public attach(canvas: HTMLCanvasElement): void {
    this._engine?.dispose();
    this._engine = new Imgstry(canvas);
  }

  public detach(): void {
    this._engine?.dispose();
    this._engine = null;
  }

  public async open(file: File): Promise<void> {
    if (!this._engine) {
      return;
    }

    this._rawSource = null;
    this._lastRebakeExposure = Number.NaN;
    this.rawSourceMode = null;

    if (isRawExtension(file.name)) {
      await this._openRaw(file);
    } else {
      await this._openStandard(file);
    }
  }

  private async _openRaw(file: File): Promise<void> {
    const engine = this._engine;
    if (!engine) return;

    const result = await Imgstry.loadRawFull(file);
    const bitmap = await createImageBitmap(result.imageData);
    try {
      engine.drawImage(bitmap);
    } finally {
      bitmap.close();
    }

    if (
      result.source === 'sensor' &&
      result.rgb16 &&
      result.whiteBalance &&
      result.blackLevel !== undefined &&
      result.whiteLevel !== undefined
    ) {
      this._rawSource = {
        rgb16: result.rgb16,
        width: result.width,
        height: result.height,
        whiteBalance: result.whiteBalance,
        blackLevel: result.blackLevel,
        whiteLevel: result.whiteLevel,
      };
      this._lastRebakeExposure = 0;
    }

    this.rawSourceMode = result.source;
    this._finalizeOpen(file.name, result.width, result.height);
  }

  private async _openStandard(file: File): Promise<void> {
    const engine = this._engine;
    if (!engine) return;

    const url = URL.createObjectURL(file);
    try {
      const image = await Imgstry.loadImage(url);
      engine.drawImage(image);
      this._finalizeOpen(file.name, image.naturalWidth, image.naturalHeight);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  private _finalizeOpen(name: string, width: number, height: number): void {
    if (!this._engine) return;
    this.imageName = name;
    this.hasImage = true;
    this.dimensions = { width, height };
    this.adjustments = clone(DEFAULT_ADJUSTMENTS);
    this.histogram = this._engine.histogram;
    this.history = [{
      id: `h${this._historyCounter++}`,
      label: 'Import',
      adjustments: clone(this.adjustments),
    }];
  }

  public requestRender(historyLabel?: string): void {
    if (!this._engine || !this.hasImage) {
      return;
    }

    if (this._debounce) {
      clearTimeout(this._debounce);
    }

    this._debounce = setTimeout(() => this._enqueueRender(historyLabel), RENDER_DEBOUNCE_MS);
  }

  public previewOriginal(show: boolean): void {
    if (!this._engine || !this.hasImage) {
      return;
    }

    this.showOriginal = show;

    if (show) {
      this._engine.clear();
      this._engine.reset();
    } else {
      this._enqueueRender();
    }
  }

  public resetAdjustments(): void {
    this.adjustments = clone(DEFAULT_ADJUSTMENTS);
    this.requestRender('Reset');
  }

  public applyPreset(preset: Partial<Adjustments>, label: string): void {
    this.adjustments = { ...clone(DEFAULT_ADJUSTMENTS), ...clone(preset) };
    this.requestRender(label);
  }

  public restoreHistory(entry: HistoryEntry): void {
    this.adjustments = clone(entry.adjustments);
    this.requestRender(`Restore: ${entry.label}`);
  }

  public async export(type: 'image/png' | 'image/jpeg'): Promise<void> {
    if (!this._engine || !this.hasImage) {
      return;
    }

    const blob = await this._engine.toBlob(type);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const extension = type === 'image/png' ? 'png' : 'jpg';
    const base = this.imageName.replace(/\.[^.]+$/, '') || 'imgstry';

    anchor.href = url;
    anchor.download = `${base}-edit.${extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private _enqueueRender(historyLabel?: string): void {
    if (this._renderPending) {
      return;
    }

    this._renderPending = true;
    this._renderQueue = this._renderQueue
      .then(() => this._render(historyLabel))
      .catch((error) => console.error('imgstry render failed', error));
  }

  private async _render(historyLabel?: string): Promise<void> {
    const engine = this._engine;

    if (!engine || this.showOriginal) {
      this._renderPending = false;
      return;
    }

    this._renderPending = false;
    this.isRendering = true;

    try {
      const settings = $state.snapshot(this.adjustments) as Adjustments;

      engine.clear();

      if (this._rawSource) {
        await this._renderRaw(engine, settings);
      } else if (isPristine(settings)) {
        engine.reset();
      } else {
        this._queueOperations(engine, settings);
        await engine.render('original');
      }

      this.histogram = engine.histogram;

      if (historyLabel) {
        const snapshot = clone(settings);
        const last = this.history.at(-1);
        const unchanged =
          last && JSON.stringify(last.adjustments) === JSON.stringify(snapshot);

        if (!unchanged) {
          this.history = [
            ...this.history,
            {
              id: `h${this._historyCounter++}`,
              label: historyLabel,
              adjustments: snapshot,
            },
          ].slice(-50);
        }
      }
    } finally {
      this.isRendering = false;
    }
  }

  private async _renderRaw(engine: Imgstry, settings: Adjustments): Promise<void> {
    const raw = this._rawSource;
    if (!raw) return;

    // Re-tonemap the linear 16-bit source whenever exposure changes;
    // other adjustments run as 8-bit ops on top of the rebaked base.
    if (settings.exposure !== this._lastRebakeExposure) {
      const rebaked = tonemap16to8(raw.rgb16, raw.width, raw.height, {
        blackLevel: raw.blackLevel,
        whiteLevel: raw.whiteLevel,
        whiteBalance: raw.whiteBalance,
        exposure: settings.exposure,
      });
      const buffer = new Uint8ClampedArray(rebaked);
      const imageData = new ImageData(buffer, raw.width, raw.height);
      const bitmap = await createImageBitmap(imageData);
      try {
        engine.drawImage(bitmap);
      } finally {
        bitmap.close();
      }
      this._lastRebakeExposure = settings.exposure;
    }

    const withoutExposure: Adjustments = { ...settings, exposure: 0 };
    if (isPristine(withoutExposure)) {
      // Rebake already on the canvas; nothing else to apply.
      return;
    }
    this._queueOperations(engine, withoutExposure);
    await engine.render('original');
  }

  // eslint-disable-next-line complexity
  private _queueOperations(engine: Imgstry, s: Adjustments): void {
    if (s.temperature) engine.temperature(s.temperature);
    if (s.tintShift) engine.tintShift(s.tintShift);
    if (s.exposure) engine.exposure(s.exposure);
    if (s.contrast) engine.contrast(s.contrast);

    if (s.highlights) engine.highlights(s.highlights);
    if (s.shadows) engine.shadows(s.shadows);
    if (s.whites) engine.whites(s.whites);
    if (s.blacks) engine.blacks(s.blacks);

    if (s.blackAndWhite) engine.blackAndWhite();

    if (s.saturation) engine.saturation(s.saturation);
    if (s.vibrance) engine.vibrance(s.vibrance);
    if (s.hue) engine.hue(s.hue);
    if (s.sepia) engine.sepia(s.sepia);
    if (s.gamma) engine.gamma(s.gamma);

    if (s.invert) engine.invert();
    if (s.tint) engine.tint(s.tint);

    if (s.splitShadows && s.splitHighlights) {
      engine.splitTone({
        shadows: s.splitShadows,
        highlights: s.splitHighlights,
        balance: s.splitBalance,
        amount: s.splitAmount,
      });
    }

    const rgbCurve = cubicMapping(s.curves.rgb);
    const rCurve = cubicMapping(s.curves.red);
    const gCurve = cubicMapping(s.curves.green);
    const bCurve = cubicMapping(s.curves.blue);

    if (rgbCurve) engine.curve({ rgb: rgbCurve });
    if (rCurve || gCurve || bCurve) {
      engine.curve({
        r: rCurve ?? undefined,
        g: gCurve ?? undefined,
        b: bCurve ?? undefined,
      });
    }

    if (s.clarity || s.texture) {
      engine.clarity(s.clarity + s.texture * .5);
    }

    if (s.sharpenAmount) {
      engine.convolve(sharpenKernel(s.sharpenAmount));
    }

    if (s.noiseReduction) {
      const { size, sigma } = noiseReductionParams(s.noiseReduction);
      engine.convolve(GaussianBlur(size, sigma));
    }

    if (s.grain) {
      engine.noise(s.grain);
    }

    if (s.vignetteAmount) {
      engine.vignette({
        amount: s.vignetteAmount,
        midpoint: s.vignetteMidpoint,
        feather: s.vignetteFeather,
      });
    }
  }
}

export const editor = new EditorState();
