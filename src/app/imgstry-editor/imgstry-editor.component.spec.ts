import {
  ComponentFixture,
  TestBed,
  async,
} from '@angular/core/testing';

import { ImgstryEditorComponent } from './imgstry-editor.component';

describe('ImgstryEditorComponent', () => {
  let component: ImgstryEditorComponent;
  let fixture: ComponentFixture<ImgstryEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImgstryEditorComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgstryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
