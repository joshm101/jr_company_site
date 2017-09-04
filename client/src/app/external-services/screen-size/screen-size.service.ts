import { Injectable } from '@angular/core';

@Injectable()
export class ScreenSizeService {
  constructor() {  }

  public get screenWidth(): number {
    // get current width of screen
    return window.document.body.offsetWidth;
  }
  public get screenHeight(): number {
    // get current height of screen
    return window.document.body.offsetHeight;
  }
}
