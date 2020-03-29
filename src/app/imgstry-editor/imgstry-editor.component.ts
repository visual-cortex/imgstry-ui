import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, Renderer2 } from '@angular/core';
import {
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';

import { BehaviorSubject } from 'rxjs';
import { Imgstry } from 'imgstry/dist/imgstry.min';

export interface ImgstryValues {
  brightness?: number;
  contrast?: number;
}

const RENDER_PROPERTIES = [
  'brightness',
  'contrast',
];

@Component({
  selector: 'imgstry-editor',
  templateUrl: './imgstry-editor.component.html',
  styleUrls: ['./imgstry-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImgstryEditorComponent implements OnInit, OnChanges {
  @ViewChild('canvas', { static: true })
  public canvas: ElementRef;

  @Input()
  public set src(url: string) {
    this._load$.next(url);
  }

  @Input()
  public brightness: number;

  @Input()
  public contrast: number;

  private _processor: Imgstry;
  private _load$ = new BehaviorSubject<string>(null);

  constructor(
    private _renderer: Renderer2,
  ) {
    this._load$
      .pipe(
        distinctUntilChanged(),
        filter(url => !!url),
      )
      .subscribe(async (url) => await this._loadImage(url));
  }

  ngOnInit() {
    this._processor = new Imgstry(this.canvas.nativeElement);
  }

  async ngOnChanges(_changes: SimpleChanges) {
    if (
      !this._processor ||
      !Object.keys(_changes).some(value => RENDER_PROPERTIES.includes(value))
    ) { return; }

    await this._processor
      .brightness(this.brightness)
      .contrast(this.contrast)
      .render('original');
  }

  private async _loadImage(url: string): Promise<void> {
    const image = await Imgstry.loadImage(url);
    console.log(image);
    this._renderer.setProperty(this.canvas.nativeElement, 'width', image.width);
    this._renderer.setProperty(this.canvas.nativeElement, 'height', image.height);
    this._processor = new Imgstry(this.canvas.nativeElement);
    this._processor.drawImage(image);
  }
}
