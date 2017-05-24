import { Directive, ElementRef, Input, Output, HostListener, OnInit, Renderer, EventEmitter } from '@angular/core';

enum ScrollDirection {
  Up = 1,
  Down = 2,
  Neutral = 3,
}
/**
 * Directive using a negative margin-top value
 * to "collapse" a component (meant for navbar).
 * This negative margin value is provided
 * as input via marginTopCollapsed (typically
 * the negative of element's height). 
 * 
 * Fully expanded component is typically defined
 * as marginTopExpanded = 0 because with no
 * margin applied, the element is where it needs
 * to be, unaffected by this directive. marginTopExpanded
 * can be provided as input to specify a value other than 0.
 */
@Directive({
  selector: '[expanding]'
})
export class ExpandingDirective implements OnInit {
  @Input() public marginTopExpanded: number = 0;
  @Input() public marginTopCollapsed: number;
  @Input() public marginThreshold: number = 0;

  @Output() public marginThresholdReachedUp: EventEmitter<boolean>;
  @Output() public marginThresholdReachedDown: EventEmitter<boolean>;
  @Output() public isCollapsing: EventEmitter<number>;
  @Output() public isExpanding: EventEmitter<number>;
  public currentMargin: number;
  private _scrollTopCache: number;

  constructor(
    public el: ElementRef,
    public renderer: Renderer,
  ) {
    this._scrollTopCache = 0;
    this.marginThresholdReachedUp = new EventEmitter<boolean>();
    this.marginThresholdReachedDown = new EventEmitter<boolean>();
    this.isCollapsing = new EventEmitter<number>();
    this.isExpanding = new EventEmitter<number>();
  }

  ngOnInit() {
    // default state is element collapsed
    this.currentMargin = this.marginTopCollapsed;
    this.renderer.setElementProperty(this.el.nativeElement, "style", "margin-top: " + this.styleString);
  }

  @HostListener('window:touchmove', [
    '$event'
  ])
  public test(event: Event) {
    console.log("touch event: ", event);
  }

  @HostListener('window:scroll', [
    '$event.target.scrollingElement.clientHeight',
    '$event.target.scrollingElement.scrollTop',
    '$event.target.scrollingElement.scrollHeight',
  ])
  public handleScrollEvent(clientHeight: number, scrollTop: number, scrollHeight: number) {
    switch(this.scrollDirection(scrollTop)) {
      case ScrollDirection.Up:
        if ((scrollTop > 0) && (scrollTop <= Math.abs(this.marginTopCollapsed))) {
          this.expandCollapseStep((scrollTop - this._scrollTopCache))
          if (this._scrollTopCache >= Math.abs(this.marginTopExpanded)) {
            this.isCollapsing.emit(scrollTop);
          }
        }
        break;
      case ScrollDirection.Neutral:
        break;
      case ScrollDirection.Down:
        if ((this._scrollTopCache < Math.abs(this.marginTopCollapsed)) 
          && scrollTop >= Math.abs(this.marginTopCollapsed)) {
          // cached scrollTop value is less than absolute value of 
          // marginTopCollapsed (so not fully expanded), but this scroll
          // event gives us a scrollTop value that is equal to, or greater,
          // than absolute value of collapsed margin (so we want to fully
          // expand the element)
          this.expandCollapseStep(1000);
          this.isExpanding.emit(scrollTop);
        }
        if ((scrollTop < Math.abs(this.marginTopCollapsed))
          && (!this.isExpanded)) {
          // scrolling down and the amount we've scrolled down
          // does not yet surpass the absolute value of collapsed
          // margin (in most cases, the margin top collapsed value
          // is the negative height of element we're expanding)
          this.expandCollapseStep((scrollTop - this._scrollTopCache))
          this.isExpanding.emit(scrollTop);
        }
        break;
    
      default:
        break;
    }
    this._scrollTopCache = scrollTop;
  }

  /**
   * Expands or collapses the element by step amount passed
   * to function. Negative values will collapse the element
   * while positive values will expand the element
   * @param amount amount to expand or collapse by
   */
  public expandCollapseStep(amount: number = 0) {
    let oldCurrentMargin = this.currentMargin;
    if (amount > 0) {
      // if the amount we are "stepping" by causes current margin to exceeed
      // marginTopExpanded amount, then we want to set currentMargin to fully
      // expanded value, otherwise set currentMargin to step amount specified.
      this.currentMargin = (this.currentMargin + amount) > this.marginTopExpanded ? 
        this.currentMargin = this.marginTopExpanded
        : this.currentMargin += amount; 

      if (this.marginThreshold <= this.currentMargin && this.marginThreshold > oldCurrentMargin) {
        this.marginThresholdReachedDown.emit(true);
      }

      this.renderer.setElementProperty(this.el.nativeElement, "style", "margin-top: " + this.styleString);
    } else {
      // if the amount we are "stepping" by causes current margin to drop
      // below marginTopCollapsed amount, then we want to set currentMargin
      // to fully collapsed value, otherweise set currentMargin to step amount specified.
      this.currentMargin = (this.currentMargin + amount) < this.marginTopCollapsed ? 
        this.currentMargin = this.marginTopCollapsed
        : this.currentMargin += amount;
        
      if (this.marginThreshold >= this.currentMargin && this.marginThreshold < oldCurrentMargin) {
        this.marginThresholdReachedUp.emit(true);
      }
      this.renderer.setElementProperty(this.el.nativeElement, "style", "margin-top: " + this.styleString);
    }
  }


  /**
   * Compare the currentScrollTop from the latest scroll event
   * and the scrollTopCache to determine whether the user
   * scrolled up, down, or stayed in the same position
   * @param currentScrollTop 
   */
  public scrollDirection(currentScrollTop: number) {
    if (currentScrollTop > this._scrollTopCache) {
      // scrollTop value is greater than _scrollTopCache
      // value, so we're further from top of page, scroll down
      return ScrollDirection.Down;
    } else {
      if (currentScrollTop === this._scrollTopCache) {
        // scrolling up at the top or scrolling down at the bottom
        return ScrollDirection.Neutral;
      } else {
        // only direction left is up
        return ScrollDirection.Up;
      }
    }
  }

  // margin-top style value
  get styleString() {
    return this.currentMargin.toString() + "px;"
  }

  // element currently expanded when
  // currentMargin is equal to max 
  // marginTopExpanded value
  get isExpanded() {
    return this.currentMargin === this.marginTopExpanded;
  }
}