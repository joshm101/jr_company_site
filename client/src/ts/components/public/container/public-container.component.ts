import { Component, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'public-container',
  templateUrl: 'public-container.component.html'
})
export class PublicContainerComponent implements OnDestroy {
  public currentUrl: string;
  private _subscriptions: Subscription[];
  private _shouldExpandNavBar: BehaviorSubject<boolean>;
  public shouldExpandNavBar$: Observable<boolean>;

  private _shouldCollapseNavLogo: boolean;
  private _navBarLinksOpacity: number;

  private _shouldExpandDiv: BehaviorSubject<boolean>;
  public shouldExpandDiv$: Observable<boolean>;

  public navBarCollapsedMargin: number = -125;
  public navBarExpandedMargin: number = 0;
  public navBarThresholdMargin: number = -55;

  constructor(
    private _activatedRoute: ActivatedRoute,
  ) {
    this._subscriptions = [];

    // subscribe to the current URL to determine
    // proper component to render
    this._subscriptions.push(
      this._activatedRoute.url.subscribe(
        (url) => {
          this.currentUrl = url.toString();
          console.log("this.currentUrl: ", this.currentUrl);
        }
      )
    );
  }

  public thresholdScrollDownExpandingNavBar() {
    this.shouldCollapseNavLogo = false;
  }

  public thresholdScrollUpExpandingNavBar() {
    this.shouldCollapseNavLogo = true;
  }

  public handleNavCollapsing(scrollTop: number) {
    if (scrollTop > Math.abs(this.navBarCollapsedMargin) - 10) {
      this.navBarLinksOpacity = 0.25;
    }
    if (scrollTop < Math.abs(this.navBarCollapsedMargin) - 10) {
      this.navBarLinksOpacity = 0;
    }   
  }

  public handleNavExpanding(scrollTop: number) {
    if (scrollTop > Math.abs(this.navBarCollapsedMargin) - 10) {
      this.navBarLinksOpacity = 0.25;
    }
    if (scrollTop >= Math.abs(this.navBarCollapsedMargin)) {
      this.navBarLinksOpacity = 1;
    }
  }

  get shouldCollapseNavLogo() {
    return this._shouldCollapseNavLogo;
  }

  set shouldCollapseNavLogo(val: boolean) {
    this._shouldCollapseNavLogo = val;
  }

  get navBarLinksOpacity() {
    return this._navBarLinksOpacity;
  }

  set navBarLinksOpacity(amount: number) {
    this._navBarLinksOpacity = amount;
  }

  ngOnDestroy() {
    // Subscriptions no longer needed, unsubscribe
    // from all of them
    this._subscriptions.forEach(subscription => 
      subscription.unsubscribe()
    );
  }

}