import type { HistogramData } from 'imgstry';
import { GaussianBlur, Imgstry } from 'imgstry';
import {
  type Adjustments,
  blurParams,
  DEFAULT_ADJUSTMENTS,
  isPristine,
  sharpenKernel,
} from './adjustments';

const RENDER_DEBOUNCE_MS = 90;

class EditorState {
  public adjustments = $state<Adjustments>({ ...DEFAULT_ADJUSTMENTS });
  public hasImage = $state(false);
  public isRendering = $state(false);
  public showOriginal = $state(false);
  public histogram = $state<HistogramData | null>(null);
  public imageName = $state('');

  private _engine: Imgstry | null = null;
  private _debounce: ReturnType<typeof setTimeout> | null = null;
  private _renderQueue: Promise<void> = Promise.resolve();
  private _renderPending = false;

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
      this.adjustments = { ...DEFAULT_ADJUSTMENTS };
      this.histogram = this._engine.histogram;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  public requestRender(): void {
    if (!this._engine || !this.hasImage) {
      return;
    }

    if (this._debounce) {
      clearTimeout(this._debounce);
    }

    this._debounce = setTimeout(() => this._enqueueRender(), RENDER_DEBOUNCE_MS);
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
    this.adjustments = { ...DEFAULT_ADJUSTMENTS };
    this.requestRender();
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

  private _enqueueRender(): void {
    if (this._renderPending) {
      return;
    }

    this._renderPending = true;
    this._renderQueue = this._renderQueue
      .then(() => this._render())
      .catch((error) => console.error('imgstry render failed', error));
  }

  private async _render(): Promise<void> {
    const engine = this._engine;

    if (!engine || this.showOriginal) {
      this._renderPending = false;
      return;
    }

    this._renderPending = false;
    this.isRendering = true;

    try {
      const settings = $state.snapshot(this.adjustments);

      engine.clear();

      if (isPristine(settings)) {
        engine.reset();
      } else {
        this._queueOperations(engine, settings);
        await engine.render('original');
      }

      this.histogram = engine.histogram;
    } finally {
      this.isRendering = false;
    }
  }

  private _queueOperations(engine: Imgstry, settings: Adjustments): void {
    if (settings.blackAndWhite) {
      engine.blackAndWhite();
    }

    if (settings.exposure) {
      engine.brightness(settings.exposure);
    }

    if (settings.contrast) {
      engine.contrast(settings.contrast);
    }

    if (settings.gamma) {
      engine.gamma(settings.gamma);
    }

    if (settings.saturation) {
      engine.saturation(settings.saturation);
    }

    if (settings.vibrance) {
      engine.vibrance(settings.vibrance);
    }

    if (settings.hue) {
      engine.hue(settings.hue);
    }

    if (settings.sepia) {
      engine.sepia(settings.sepia);
    }

    if (settings.noise) {
      engine.noise(settings.noise);
    }

    if (settings.invert) {
      engine.invert();
    }

    if (settings.sharpen) {
      engine.convolve(sharpenKernel(settings.sharpen));
    }

    if (settings.blur) {
      const { size, sigma } = blurParams(settings.blur);
      engine.convolve(GaussianBlur(size, sigma));
    }
  }
}

export const editor = new EditorState();
