import { Directive, Input, Output, EventEmitter, Renderer, ElementRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';


@Directive({
  selector: '[marginTop]'
})
export class MarginTopDirective implements OnInit {

  // set marginTop amount to apply to host element
  @Input() public set marginTop(val: number) {
    this._marginTop = val || 0;
    if (this._prevMarginTop) {
      if (this.marginTop !== this._prevMarginTop) {
        // different marginTop value being set.
        this._handleMarginTopChange();
        this._prevMarginTop = this._marginTop;
      }
    } else {
      this._prevMarginTop = this._marginTop;
    }
  }

  // get marginTop amount to apply to host element
  public get marginTop() {
    return this._marginTop;
  }

  // amount of time to change marginTop value if
  // marginTop value is being changed by +- 1px
  // every ms.
  private get _timeRange() {
    if (!this._prevMarginTop && this._prevMarginTop !== 0) {
      return Math.abs(this.marginTop);
    }
    return Math.abs(Math.abs(this._prevMarginTop) - Math.abs(this.marginTop));
  }

  // evaluates CSS value string, e.g., '150px'
  private get styleString() {
    return this.effectiveMargin.toString() + 'px';
  }

  public set effectiveMargin(val: number) {
    this._effectiveMargin = val;
  }

  public get effectiveMargin() {
    return this._effectiveMargin;
  }

  private _marginTop: number;
  private _prevMarginTop: number;
  private _increasing: boolean = false;
  private _effectiveMargin: number;

  constructor(
    private _el: ElementRef,
    private _renderer: Renderer,
  ) {

  }

  ngOnInit() {
    this.effectiveMargin = this.marginTop;
    this._setEffectiveCurrentMarginStyle();

  }

  private _handleMarginTopChange() {
    this._determineAndSetDirection();
    Observable.interval(1).take(this._timeRange).subscribe(
      () => {
        console.log('wat');
        this.effectiveMargin = this._increasing ? this.effectiveMargin + 1 : this.effectiveMargin - 1;
        this._setEffectiveCurrentMarginStyle();
      }
    )
  }

  private _determineAndSetDirection() {
    if (!this._prevMarginTop && this._prevMarginTop !== 0) {
      this._increasing = false;
    }
    // this function is only called as a result
    // of a CHANGED marginTop value, so
    // do nothing in case this function
    // is ever called with matching marginTop values
    if (this._prevMarginTop === this.marginTop) {
      return;
    }

    if (this._prevMarginTop > this.marginTop) {
      // marginTop value has decreased, set flag
      // that will be used to determine if
      // we are adding or subtracting 1px every
      // millisecond in our Observable interval timeRange
      this._increasing = false;
    } else {
      // marginTop value has increased, set flag
      this._increasing = true;
    }
  }

  private _setEffectiveCurrentMarginStyle() {
    this._renderer.setElementProperty(this._el.nativeElement, "style", "margin-top: " + this.styleString);
  }
}