import { 
  Directive, 
  Output, 
  EventEmitter, 
  HostListener, 
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { WindowRefService } from '../external-services/window/window.service';

@Directive({
  selector: '[scrollInView]'
})
export class ScrollInViewDirective implements OnInit, OnDestroy {
  @Output()
  public onPartiallyInView: EventEmitter<boolean>;
  @Output()
  public onFullyInView: EventEmitter<boolean>;

  private subscriptions: Subscription[] = [];
  
  constructor(
    private hostElementReference: ElementRef,
    private windowRefService: WindowRefService
  ) {
    this.onPartiallyInView = new EventEmitter<boolean>();
    this.onFullyInView = new EventEmitter<boolean>();
    this.subscriptions.push(
      Observable.fromEvent(window, 'scroll').throttleTime(100).subscribe(
        (event: any) => {
          let scrollTop = event.target.scrollingElement.scrollTop;
          let clientHeight = event.target.scrollingElement.clientHeight;
          this.onWindowScrollEvent(scrollTop, clientHeight);
        }
      )
    ) 
  }

  ngOnInit() {
    const scrollTop = this.windowRefService.nativeWindow.scrollY;
    const clientHeight = this.windowRefService.nativeWindow.innerHeight;
    this.onWindowScrollEvent(scrollTop, clientHeight);
  }

  onWindowScrollEvent(
    scrollTop: number,
    clientHeight: number
  ) {
    const topOfPageLocation = scrollTop;
    const bottomOfPageLocation = scrollTop + clientHeight;
    const boundingRectangle = this.hostElementReference.nativeElement.getBoundingClientRect();
    const hostElementTopLocation = boundingRectangle.top + scrollTop;
    const hostElementBottomLocation = hostElementTopLocation + this.hostElementReference.nativeElement.offsetHeight;
    if (this.isPartiallyInView(
      topOfPageLocation,
      bottomOfPageLocation,
      hostElementTopLocation,
      hostElementBottomLocation
    )) {
      this.onPartiallyInView.emit(true);
    }

    if (this.isFullyInView(
      topOfPageLocation,
      bottomOfPageLocation,
      hostElementTopLocation,
      hostElementBottomLocation
    )) {
      this.onFullyInView.emit(true);
    }
  }

  /* Below functions derived from
   * https://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
   */

  private isPartiallyInView(
    topOfPageLocation: number,
    bottomOfPageLocation: number,
    hostElementTopLocation: number,
    hostElementBottomLocation: number
  ) {
    return (
      (bottomOfPageLocation >= hostElementTopLocation)
      &&
      (topOfPageLocation <= hostElementBottomLocation)
    );
  }

  private isFullyInView(
    topOfPageLocation: number,
    bottomOfPageLocation: number,
    hostElementTopLocation: number,
    hostElementBottomLocation: number
  ) {
    return (
      (bottomOfPageLocation > hostElementBottomLocation)
      &&
      (topOfPageLocation < hostElementTopLocation)
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription =>
      subscription.unsubscribe()
    );
  }

}
