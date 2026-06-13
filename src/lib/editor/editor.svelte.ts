import {
  CubicSpline,
  GaussianBlur,
  type HistogramData,
  Imgstry,
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

  private _engine: Imgstry | null = null;
  private _debounce: ReturnType<typeof setTimeout> | null = null;
  private _renderQueue: Promise<void> = Promise.resolve();
  private _renderPending = false;
  private _historyCounter = 0;

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

    const url = URL.createObjectURL(file);

    try {
      const image = await Imgstry.loadImage(url);
      this._engine.drawImage(image);
      this.imageName = file.name;
      this.hasImage = true;
      this.dimensions = { width: image.width as number, height: image.height as number };
      this.adjustments = clone(DEFAULT_ADJUSTMENTS);
      this.histogram = this._engine.histogram;
      this.history = [{
        id: `h${this._historyCounter++}`,
        label: 'Import',
        adjustments: clone(this.adjustments),
      }];
    } finally {
      URL.revokeObjectURL(url);
    }
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

      if (isPristine(settings)) {
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
