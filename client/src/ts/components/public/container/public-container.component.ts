import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable, Subscription } from 'rxjs/Rx';

import { EmbedPostService, EmbedPost } from '../../embed-post/embed-post.index';
import { WindowRefService } from '../../../external_services/window/window.service';

enum ScrollDirection {
  Up = 1,
  Down = 2,
  Neutral = 3,
}

@Component({
  selector: 'public-container',
  templateUrl: 'public-container.component.html'
})
export class PublicContainerComponent implements OnDestroy, OnInit {
  public currentUrl: string;
  private _subscriptions: Subscription[];
  private _shouldCollapseNavLogo: boolean;
  private _navBarLinksOpacity: number;
  private _navBarLinksDisplay: string;
  private _scrollTopCache: number;
  private _navBarInitialized: boolean = false;
  private _navBarMarginTop: number;
  private _previousMarginTop: number;
  private _previousFadeNavBar: boolean;
  private _previousNavBarLinksOpacity: number;
  private _scrollTopChange: number;
  private _hoverOverride: boolean = false;
  private _mobileOverride: boolean = false;
  private _menuIsOpen: boolean;
  public screenWidth: number;
  public navBarCollapsedMargin: number = -125;
  public navBarExpandedMargin: number = 0;
  public navBarThresholdMargin: number = -55;
  private readonly NAVBAR_MOSTLY_EXPANDED = -55/4;
  private readonly MARGIN_ANIMATION_TIME_MS = 300;
  private readonly SLIGHT_MARGIN_ANIMATION_TIME_MS = 50;
  private _animationFrameId: number = undefined;
  private _fadeNavBar: boolean;
  private _hideLinks: boolean;

  public set navBarMarginTop(val: number) {
    requestAnimationFrame((_) => {
      if (!isNaN(val)) {
        // value is valid number
        // LIMIT: this.navBarCollapsedMargin <= val <= this.navBarExpandedMargin
        if (!this._valueExceedsExpandedMargin(val) && !this._valueIsBelowCollapsedMargin(val)) {
          this._navBarMarginTop = val;
        } else {
          // passed in value is not a number, set to collapsed.
          this._navBarMarginTop = this.navBarCollapsedMargin;
        }
      }
    });
  }

  /**
   * Returns true if value parameter exceeds
   * this.navBarExpandedMargin value
   * @param value 
   */
  private _valueExceedsExpandedMargin(value: number = 0) {
    return value > this.navBarExpandedMargin;
  }

  /**
   * Returns true if the value parameter is below
   * this.navBarCollapsedMargin value
   * @param value 
   */
  private _valueIsBelowCollapsedMargin(value: number = 0) {
    return value < this.navBarCollapsedMargin;
  }

  public get navBarMarginTop() {
    // fail-safe in case, for whatever reason, 
    // _navBarMarginTop is set to a value outside
    // acceptable range:
    // navBarCollapsedMargin <= _navBarMarginTop <= navBarExpandedMargin
    this._ensureValidNavBarMarginTop();

    return this._navBarMarginTop;
  }

  /**
   * Used by navBarMarginTop getter to enforce max and
   * minimum possible values for _navBarMarginTop which
   * is returned by the navBarMarginTop getter.
   */
  private _ensureValidNavBarMarginTop() {
    if (this._navBarMarginTop > this.navBarExpandedMargin) {
      // _navBarMarginTop is set above the max value (navBarExpandedMargin).
      this._navBarMarginTop = this.navBarExpandedMargin;
    } else {
      if (this._navBarMarginTop < this.navBarCollapsedMargin) {
        // _navBarMarginTop is set below the minimum value (navBarCollapsedMargin).
        this._navBarMarginTop = this.navBarCollapsedMargin;
      }
    }
  }

  public set scrollTopChange(val: number) {
    this._scrollTopChange = val;
  }

  public get scrollTopChange() {
    return this._scrollTopChange;
  }

  public embedPosts: EmbedPost[];


  get shouldCollapseNavLogo() {
    return this._shouldCollapseNavLogo;
  }

  set shouldCollapseNavLogo(val: boolean) {
    this._shouldCollapseNavLogo = val;
  }

  get fadeNavBar() {
    return this._fadeNavBar;
  }

  set fadeNavBar(val: boolean) {
    this._fadeNavBar = val;
  }

  get hideLinks() {
    return this._hideLinks;
  }

  set hideLinks(val: boolean) {
    this._hideLinks = val;
  }

  set navBarLinksOpacity(amount: number) {
    if (amount > 1) {
      amount = 1;
    } else {
      if (amount < 0) {
        amount = 0;
      }
    }

    this._navBarLinksOpacity = amount;
  }

  private get _expandedScrollTopValue() {
    return Math.abs(this.navBarCollapsedMargin);
  }  

  get navBarLinksOpacity() {
    return this._navBarLinksOpacity;
  }

  get marginTopStyleString() {
    return this.navBarMarginTop + 'px';
  }

  get window() {
    return this._windowRefService.nativeWindow;
  }  

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _embedPostService: EmbedPostService,
    private _windowRefService: WindowRefService,
  ) {
    this._subscriptions = [];
    this._shouldCollapseNavLogo = true;
    this._navBarMarginTop = this.navBarCollapsedMargin;
    this._navBarLinksOpacity = 0;
    this.fadeNavBar = false;
    // subscribe to the current URL to determine
    // proper component to render
    this._subscriptions.push(
      this._activatedRoute.url.subscribe(
        (url) => {
          this.currentUrl = url.toString();
        }
      ),
    );

    this._embedPostService.getAll().filter(posts => !!posts).subscribe(
      (embedPosts) => {
        console.log("embedPosts: ", embedPosts);
        this.embedPosts = embedPosts;
      }      
    )
  }

  ngOnInit() {
    this.determineAndSetMobileOverride();
  }

  /**
   * Entry-point for smooth expand recursive method. Creates
   * an initial timestamp and invokes the recursive function
   * @param amount amount to expand
   * @param startingValue starting margin-top value
   * @param numberMilliseconds length of animation in milliseconds
   */
  private _initiateSmoothExpand(amount: number, startingValue: number, numberMilliseconds: number) {
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
    }
    this._animationFrameId = requestAnimationFrame(ts => this._smoothExpand(ts, ts, numberMilliseconds, amount, startingValue));
  }

  /**
   * Entry-point for smooth collapse recursive method. Creates
   * an initial timestamp and invokes the recursive function.
   * @param amount amount to collapse
   * @param startingValue starting margin-top value
   * @param numberMilliseconds length of animation in milliseconds
   */
  private _initiateSmoothCollapse(amount: number, startingValue: number, numberMilliseconds: number) {
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
    }
    this._animationFrameId = requestAnimationFrame(ts => this._smoothCollapse(ts, ts, numberMilliseconds, amount, startingValue));
  }  

  /**
   * Recursive function which will automatically/smoothly expand
   * the navbar by the specified amount over duration milliseconds.
   * This function (at each "iteration") will:
   * - expand the navbar by an amount derived from current
   *   progress parameter and amount parameter.
   * - invoke itself within the context of requestAnimationFrame() (to prevent layout thrashing)
   * @param timestamp current timestamp
   * @param initialTime initial timestamp
   * @param duration duration of smooth expand
   * @param amount total amount to expand by
   * @param startingValue starting value of entire smooth expand invokation
   */
  private _smoothExpand(timestamp: number, initialTime: number, duration: number, amount: number, startingValue: number) {
    if (!initialTime) {
      initialTime = timestamp;
    }
    let elapsedTime = this._calculateElapsedTime(timestamp, initialTime);
    let progress = this._calculateProgress(elapsedTime, duration);
    if (progress <= 1) {
      this._smoothExpandCalculateApplyMarginTop(startingValue, amount, progress);
      requestAnimationFrame(ts => this._smoothExpand(ts, initialTime, duration, amount, startingValue)); 
    }
  }

  /**
   * Calculates and applies the correct/latest margin-top value for
   * a smooth expansion given the start value, the amount to expand,
   * and the current progress of smooth expand.
   * @param absoluteStartValue initial margin-top value of smooth expand
   * @param amount amount to expand
   * @param progress current smooth expand progress
   */
  private _smoothExpandCalculateApplyMarginTop(absoluteStartValue: number, amount: number, progress: number) {
    let currentIterationIncreaseAmount = parseFloat((amount * progress).toFixed(2));
    this._navBarMarginTop = absoluteStartValue + currentIterationIncreaseAmount;
    if (this._navBarMarginTop >= this.navBarThresholdMargin) {
      this.shouldCollapseNavLogo = false;
      this._smoothExpandUpdateOpacity();
    }
  }

  /**
   * Updates opacity of navbar during a smooth/automated
   * expansion depending on navbar's current position
   */
  private _smoothExpandUpdateOpacity() {
    requestAnimationFrame(ts => {
      if (this._navBarMarginTop >= this.NAVBAR_MOSTLY_EXPANDED) {
        this.navBarLinksOpacity += 0.2;
      }
      if (this._navBarMarginTop === this.navBarExpandedMargin) {
        this.navBarLinksOpacity = 1;
      }
    });
  }

  /**
   * Recursive function which will automatically/smoothly collapse
   * the navbar by the specified amount over duration milliseconds.
   * This function (at each "iteration") will: 
   * - update (reduce) the opacity depending on the current position of the navbar.
   * - collapse the navbar by an amount derived from current
   *   progress parameter and amount parameter.
   * - invoke itself within the context of requestAnimationFrame() (to prevent layout thrashing)
   * 
   * The above actions occur as long as progress <= 1.
   * @param timestamp current timestamp
   * @param initialTime initial timestamp
   * @param duration duration of smooth collapse
   * @param amount total amount to collapse by
   * @param startingValue starting value of entire smooth collapse invokation 
   */
  private _smoothCollapse(timestamp: number, initialTime: number, duration: number, amount: number, startingValue: number) {
    if (!initialTime) {
      initialTime = timestamp;
    }

    // calculate progress to determine if collapse needs to occcur.
    let elapsedTime = this._calculateElapsedTime(timestamp, initialTime);
    let progress = this._calculateProgress(elapsedTime, duration);

    if (progress <= 1) {
      // progress <= 1, so update opacity and collapse
      this._smoothCollapseUpdateOpacity();
      this._smoothCollapseCalculateApplyMarginTop(startingValue, amount, progress);

      // continue to next iteration/stage since progress <= 1
      requestAnimationFrame(ts => this._smoothCollapse(ts, initialTime, duration, amount, startingValue));
    }
  }

  /**
   * Calculates and applies the correct/latest margin-top value for
   * a smooth collapse given the start value, the amount to collapse,
   * and the current progress of smooth collapse.
   * @param absoluteStartValue initial margin-top value of smooth collapse
   * @param amount amount to collapse
   * @param progress current smooth collapse progress
   */
  private _smoothCollapseCalculateApplyMarginTop(absoluteStartValue: number, amount: number, progress: number) {
    let currentIterationDecreaseAmount = parseFloat((amount * progress).toFixed(2));
    this._navBarMarginTop  = absoluteStartValue - currentIterationDecreaseAmount;
    if (this._navBarMarginTop <= this.navBarThresholdMargin) {
      this.shouldCollapseNavLogo = true;
    }
  }

  /**
   * Updates opacity of navbar during a smooth/automated
   * collapse depending on navbar's current position
   */
  private _smoothCollapseUpdateOpacity() {
    requestAnimationFrame(ts => {
      if (this.navBarMarginTop > this.NAVBAR_MOSTLY_EXPANDED) {
        this._decreaseNavLinksOpacityByAmount(0.1);
      } 
      if (this.navBarMarginTop < this.NAVBAR_MOSTLY_EXPANDED) {
        this.navBarLinksOpacity = 0;
      }
    });
  }  

  /**
   * Calculates & returns elapsed time in milliseconds from 
   * current time passed in and a start time
   * @param currentTime current timestamp
   * @param initialTime initial timestamp
   */
  private _calculateElapsedTime(currentTime: number, initialTime: number) {
    return currentTime - initialTime;
  }

  /**
   * Returns current progress of a smooth collapse/expand 
   * @param elapsedTime number of milliseconds elapsed
   * @param duration total duration in milliseconds
   */
  private _calculateProgress(elapsedTime: number, duration: number) {
    return parseFloat((elapsedTime / duration).toFixed(2));
  }

  private _enableHoverOverride() {
    this._hoverOverride = true;
  }

  private _disableHoverOverride() {
    this._hoverOverride = false;
  }

  /**
   * Function invoked on navbar mouseover. On navbar mouseover,
   * the navbar should become fully expanded with links fully visible.
   */
  public navBarMouseEnter() {
    if (!this._mobileOverride && this.screenWidth > 640) {
      this._enableHoverOverride();
      
      // save current values for eventual mouseout event
      this._previousMarginTop = this._navBarMarginTop;
      this._previousFadeNavBar = this.fadeNavBar;
      this._previousNavBarLinksOpacity = this.navBarLinksOpacity;
      
      this._disableNavBarFade();

      // calculate difference from fully expanded state and invoke smooth
      // expand for calculated amount.
      let differenceRemaining = Math.abs(this._navBarMarginTop - this.navBarExpandedMargin);
      if (differenceRemaining > 0) {
        this._initiateSmoothExpand(differenceRemaining, this._navBarMarginTop, this.MARGIN_ANIMATION_TIME_MS);
      }
    }
  }

  /**
   * Function invoked on navbar mouseleave. On navbar mouseleave,
   * the nav bar should return to the previous state before the
   * last mouseover occurred.
   */
  public navBarMouseLeave() {
    if (!this._mobileOverride && this.screenWidth > 640) {
      if (this._previousMarginTop < this.navBarMarginTop) {
        // there's a difference between current navBarMarginTop and
        // the value before mousenter. calculate difference and
        // collapse for calculated amount
        let difference = Math.abs(this.navBarMarginTop - this._previousMarginTop);
        this._initiateSmoothCollapse(difference, this._navBarMarginTop, this.MARGIN_ANIMATION_TIME_MS);
      }
      this.navBarLinksOpacity = this._previousNavBarLinksOpacity;
      this.fadeNavBar = this._previousFadeNavBar;
      this._disableHoverOverride();
    }
  }  

  /**
   * Function invoked on window resize. On window resize,
   * determine if we should render mobile menu or non-mobile menu
   */
  @HostListener('window:resize', [])
  public _handleResizeEvent() {
    this.determineAndSetMobileOverride();
  }

  /**
   * Determines current window width & applies
   * mobile menu or non-mobile menu, depending on
   * calculated width.
   */
  public determineAndSetMobileOverride() {
    this.screenWidth = window.innerWidth
    let body = document.getElementsByTagName('body')[0];  
    console.log("this.screenWidth: ", this.screenWidth);  
    if (this.screenWidth <= 640) {
      // mobile display

      this._mobileOverride = true;
      this._disableNavBarFade();
      this._shouldCollapseNavLogo = false;
      if (this._menuIsOpen) {
        // mobile display and the mobile menu is open, prevent
        // body scrolling.
        body.classList.add('prevent-body-scroll');
        this.navBarLinksOpacity = 1;
      }
    } else {
      // non-mobile display
      this._mobileOverride = false;

      // non-mobile display, enable body scrolling
      body.classList.remove('prevent-body-scroll');
      console.log("this.navBarMarginTop: ", this.navBarMarginTop);
      console.log("this.navbarTresholdMargin: ", this.navBarThresholdMargin);
      if (this.navBarMarginTop <= this.navBarThresholdMargin) {
        this.shouldCollapseNavLogo = true;
        this.navBarLinksOpacity = 0;
      }
    }
  }

  public handleMenuOpenStatusChange(isOpen: boolean) {
    this.navBarLinksOpacity = 1;
    let body = document.getElementsByTagName('body')[0];
    if (isOpen) {
      this._menuIsOpen = true;
      // overflow-y hidden class applied to body tag. Better overall
      // UX with some trade-off of a tiny flicker on logo positioning
      // when mobile menu opens. Also when opening the menu, there's a 1px
      // line at the bottom of the menu that isn't covered, meaning you'll
      // see a tiny bit of what's behind that menu in the aformentioned line.
      // This behavior is deemed better than the behavior seen when
      // scrolling in the mobile menu on https://themill.com (as of 8/19/2017)
      body.classList.add('prevent-body-scroll');
    } else {
      this._menuIsOpen = false;
      body.classList.remove('prevent-body-scroll');
      //this.navBarLinksOpacity = 0;
    }
  }

  /**
   * Top level scrolling event handler. This method dispatches the appropriate
   * handler function based on direction moved (up or down) during the latest
   * scroll event.
   * @param scrollTop 
   * @param scrollHeight 
   */
  @HostListener('window:scroll', [
    '$event.target.scrollingElement.scrollTop',
    '$event.target.scrollingElement.scrollHeight',
  ])
  public _handleScrollEvent(scrollTop: number, scrollHeight: number) {
    this._calculateScrollTopChange(scrollTop);
    if (!this._hoverOverride && !this._mobileOverride) {
      if (this._navBarInitialized) {
        switch(this.scrollDirection(scrollTop)) {
          case ScrollDirection.Down:
            this._handleScrollDownEvent(scrollTop, this.scrollTopChange);
            break;
          case ScrollDirection.Up:
            this._handleScrollUpEvent(scrollTop, this.scrollTopChange);
            break;
          case ScrollDirection.Neutral:
          default:
            break;
        }
      }
      if (!this._navBarInitialized) {
        this._initializeNavBar();
        this._navBarInitialized = true;
      }      
    }
    this._scrollTopCache = scrollTop;
  }

  /**
   * Handles initialization of navbar based off of starting
   * scrollTop value
   */
  private _initializeNavBar() {
    if (window.scrollY <= 625) {
      // any scroll distance amount less than 625 should cause the nav
      // bar to be fully expanded on initialization 
      let amount = Math.min(window.scrollY, Math.abs(this.navBarCollapsedMargin));
      if (this._navBarMarginTop + amount >= this.navBarThresholdMargin) {
        // calculated amount to expand by results in navBarMarginTop value
        // greater than or equal to threshold, fix the logo's position
        this.shouldCollapseNavLogo = false;
      }
      if (this._navBarMarginTop + amount >= this.NAVBAR_MOSTLY_EXPANDED) {
        // calculated amount to expand by results in navBarMarginTop value
        // being greater than or equal to point where nav bar links should
        // start appearing. Increase opacity.
        this.navBarLinksOpacity += 0.25;
      }
      if (this._navBarMarginTop + amount >= this.navBarExpandedMargin) {
        // calculated amount to expand by results in navBarMarginTop value
        // being greater than or equal to fully expanded value, links should
        // be fully visible. Set max opacity.
        this.navBarLinksOpacity = 1;
      }      
      this._expandNavByAmount(amount);
      this._expandDone();
    } else {
      // scroll distance amount > 625, expand to threshold & fade navbar.
      let difference = Math.abs(this.navBarMarginTop - this.navBarThresholdMargin);
      this._enableNavBarFade();
      this._expandNavByAmount(difference);
      this.shouldCollapseNavLogo = false;
    }
  }

  private _handleScrollDownEvent(scrollTop: number, change: number) {
    /**
     * Scrolling down in region 0 <= scrollTop <= 125
     * Nav bar should expand in this region while
     * scrolling down
     */
    if (0 <= scrollTop && scrollTop < this._expandedScrollTopValue) {
      this._disableNavBarFade();
      if (this.navBarMarginTop + change > this.navBarThresholdMargin) {
        this.shouldCollapseNavLogo = false;
      }
      this._expandNavByAmount(change);
      this._expandDone();  
    }

    if (125 <= scrollTop && scrollTop <= 625) {
      // region where links should be fully visible
      // and nav bar should be fully expanded
      if (change < 30) {
        this.navBarLinksOpacity += 0.25;
      } else {
        this.navBarLinksOpacity = 1;
      }

      if (this.navBarMarginTop + change > this.navBarThresholdMargin) {
        this.shouldCollapseNavLogo = false;
      }
      this._expandNavByAmount(change);
    }


    /**********************************************/

    /**
     * Scrolling down in region 625 < scrollTop <= 695
     * Nav bar should collapse to navBarThresholdMargin 
     * in this region when scrolling down
     */
    if (625 < scrollTop) {
      if (this._changeKeepsNavBarAboveThreshold(change, this.navBarMarginTop, false)) {
        // collapsing by given amount keeps nav bar above threshold
        if (this.navBarMarginTop - change >= this.NAVBAR_MOSTLY_EXPANDED) {
          this.navBarLinksOpacity -= 0.25;
        } else {
          this.navBarLinksOpacity = 0;
        }
        this._enableNavBarFade();
        this._collapseNavByAmount(change);
      } else {
        // collapsing by given amount would drop nav bar below threshold,
        // set nav bar margin top to threshold value
        this.navBarLinksOpacity = 0;
        this._enableNavBarFade();
        this.navBarMarginTop = this.navBarThresholdMargin;
      }
      this._collapseDone();
    }
  }

  private _handleScrollUpEvent(scrollTop: number, change: number) {
    if (isNaN(change)) {
      if (scrollTop < 125) {
        this._expandNavByAmount(scrollTop);
        this._expandDone();
      }
    } else {

      /**
       * Scrolling up in region 0 <= scrollTop <= _expandedScrollTopValue
       * Nav bar should collapse in this region while
       * scrolling up
       */
      if (scrollTop < this._expandedScrollTopValue) {
        requestAnimationFrame(ts => {
          this.navBarLinksOpacity -= 0.25;
        }); 

        if (scrollTop !== 0) {
          if (this.navBarMarginTop - change >= this.navBarCollapsedMargin) {
            this._collapseNavByAmount(change);
            this._collapseDone();
          } else {
            let differenceRemaining = Math.abs(this.navBarMarginTop - this.navBarCollapsedMargin);
            this._collapseNavByAmount(differenceRemaining);
            this._collapseDone();
          }

        } else {
          // scrollTop === 0
          // ensures navBarMarginTop is fully collapsed
          // when scrolled all the way to the top
          this.navBarMarginTop = this.navBarCollapsedMargin;
          this.navBarLinksOpacity = 0;
          this.shouldCollapseNavLogo = true;
        }

      }

      /**
      * Scrolling up in region scrollTop < _expandedScrollTopValue
      * Nav bar should expand in this region while
      * scrolling up
      */
      if (scrollTop > this._expandedScrollTopValue) {
        this._expandNavByAmount(change);
        this._disableNavBarFade();
        this._expandDone();
      }
    }

  }


  /**
   * Handler function after non-smooth expand completes.
   * Uses requestAnimationFrame() to prevent layout thrashing.
   */
  private _expandDone() {
    requestAnimationFrame(ts => {
      // any expansion should remove any navbar fade.
      this._disableNavBarFade();

      if (this._navExpandedAtLeastThreshold()) {
        this.shouldCollapseNavLogo = false;
      }       
      
      if (this._navBarMostlyExpanded()) {
        this._increaseNavLinksOpacityByAmount(0.25);
      }
      // if nav bar is now fully expanded, make 
      // links fully visible 
      if (this._navBarExpanded()) {
        this.navBarLinksOpacity = 1;
      } 
    });
  }

  /**
   * Handler function after non-smooth collapse completes.
   * Uses requestAnimationFrame() to prevent layout thrashing.
   */
  private _collapseDone() {
    requestAnimationFrame(ts => {
      if (!this._navExpandedAtLeastThreshold()) {
        this.navBarLinksOpacity = 0;
      }
      if (this._navExpandedAtLeastThreshold()) {
        // collapse kept nav bar above threshold.
        if(this._navBarMarginTop > this.NAVBAR_MOSTLY_EXPANDED) {
          this.navBarLinksOpacity -= 0.25;
        } else { 
          this.navBarLinksOpacity = 0;
        }

        this.shouldCollapseNavLogo = false;
      } else {
        this.shouldCollapseNavLogo = true;
      }
    });
  }

  private _enableNavBarFade() {
    this.fadeNavBar = true;
  }

  private _disableNavBarFade() {
    this.fadeNavBar = false;
  }

  /**
   * Determines if a given change will keep the navbar
   * "mostly expanded" defined by NAVBAR_MOSTLY_EXPANDED
   * constant.
   * @param change amount to change marginTop value by
   * @param currentMarginTop 
   * @param expanding whether the change is to expand or collapse
   */
  private _changeKeepsNavBarMostlyExpanded(change: number, currentMarginTop: number, expanding: boolean) {
    if (!expanding) {
      // collapse change
      return currentMarginTop - change > this.NAVBAR_MOSTLY_EXPANDED;
    }
    // expanding change
    return currentMarginTop + change > this.NAVBAR_MOSTLY_EXPANDED;
  }

  /**
   * Determines if a given change will keep the nav bar
   * margin top value above threshold defined by 
   * navBarThresholdMargin
   * @param change amount to change marginTop value by
   * @param currentMarginTop 
   * @param expanding whether the change is to expand or collapse
   */
  private _changeKeepsNavBarAboveThreshold(change: number, currentMarginTop: number, expanding: boolean) {
    if (!expanding) {
      // collapse change
      return currentMarginTop - change > this.navBarThresholdMargin;
    }
    // expanding change
    return currentMarginTop + change > this.navBarThresholdMargin;
  } 

  /**
   * Returns true if margin-top value of nav bar is
   * greater than "mostly expanded" defined by
   * NAVBAR_MOSTLY_EXPANDED constant
   */
  private _navBarMostlyExpanded() {
    return this.navBarMarginTop > this.NAVBAR_MOSTLY_EXPANDED;
  }

  /**
   * Returns true if margin-top value of nav bar is
   * equal to the fully expanded margin-top value.
   */
  private _navBarExpanded() {
    return this.navBarMarginTop === this.navBarExpandedMargin;
  }

  /**
   * Returns true if margin-top value of nav bar is
   * at least the threshold margin-top value.
   */
  private _navExpandedAtLeastThreshold() {
    return this.navBarMarginTop >= this.navBarThresholdMargin;
  }

  /**
   * Expands nav bar by amount given by amt. If current margin top value
   * of nav bar plus amt is greater than this.navBarExpandedMargin, set
   * navigation bar to this.navBarExpandedMargin
   * @param amt amount to expand navigation bar
   */
  private _expandNavByAmount(amt: number) {
    amt = Math.abs(amt);
    if (this.navBarMarginTop + amt >= this.navBarExpandedMargin) {
      // amount expanding by exceeds expanded margin amount,
      // so set nav bar to expanded margin value
      this.navBarMarginTop = this.navBarExpandedMargin;
    } else {
      // amount expanding does not exceed expanded margin amount,
      // calculate new margin top value and apply.
      this.navBarMarginTop = this._navBarMarginTop + amt;
    }
  }

  /**
   * Collapses nav bar by amount given by amt. If current margin top value
   * of nav bar minus amt is les than this.navBarCollapsedMargin, set
   * navigation bar to this.navBarCollapsedMargin.
   * @param amt amount to collapse navigation bar
   */
  private _collapseNavByAmount(amt: number) {
    amt = Math.abs(amt);
    if (this.navBarMarginTop - amt <= this.navBarCollapsedMargin) {
      // amount collapsing by is below collapsed margin amount,
      // so set nav bar to collapsed margin value
      this.navBarMarginTop = this.navBarCollapsedMargin;
    } else {
      // amount expanding does not fall below collapsed margin awmount,
      // calculate new margin top value and apply.
      this.navBarMarginTop = this.navBarMarginTop - amt;
    }
  }

  /**
   * Increases nav bar links opacity by amt. If amt to increase
   * by plus current opacity is greater than 1, set opacity to 1.
   * else, increase opacity by amt given
   * @param amt 
   */
  private _increaseNavLinksOpacityByAmount(amt: number) {
    amt = Math.abs(amt);
    if (this.navBarLinksOpacity + amt > 1) {
      this.navBarLinksOpacity = 1;
    } else {
      this.navBarLinksOpacity += amt;
    }
  }

  /**
   * Decreases nav bar links opacity by amt. If amt to decrease
   * minus current opacity is less than 0, set opacity to 0.
   * else, decrease opacity by amt given.
   * @param amt 
   */
  private _decreaseNavLinksOpacityByAmount(amt: number) {
    amt = Math.abs(amt);
    if (this.navBarLinksOpacity - amt < 0) {
      this.navBarLinksOpacity = 0;
    } else {
      this.navBarLinksOpacity = this.navBarLinksOpacity - amt;
    }
  }

  /**
   * Given the latest scrollTop value, use the _scrollTopCache value
   * to determine net change in scrollTop value since last
   * scroll event. Assigns value to class property scrollTopChange
   * @param scrollTop latest scrollTop value
   */
  private _calculateScrollTopChange(scrollTop: number) {
    this.scrollTopChange = Math.abs(Math.abs(scrollTop) - Math.abs(this._scrollTopCache));
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

  ngOnDestroy() {
    // Subscriptions no longer needed, unsubscribe
    // from all of them
    this._subscriptions.forEach(subscription => 
      subscription.unsubscribe()
    );
  }

}