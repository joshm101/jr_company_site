import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs/Rx';

/**
 * Dedicated ervice used to get body's width and height.
 */
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