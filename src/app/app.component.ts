import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

import { ImgstryValues } from 'app/imgstry-editor/imgstry-editor.component';

@Component({
  selector: 'imgstry-ui',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public value: ImgstryValues = {
    brightness: 0,
    contrast: 0,
  };
}
