import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'public-container',
  templateUrl: 'public-container.component.html'
})
export class PublicContainerComponent implements OnDestroy {
  public currentUrl: string;
  private _subscriptions: Subscription[];

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

  ngOnDestroy() {
    // Subscriptions no longer needed, unsubscribe
    // from all of them
    this._subscriptions.forEach(subscription => 
      subscription.unsubscribe()
    );
  }

}