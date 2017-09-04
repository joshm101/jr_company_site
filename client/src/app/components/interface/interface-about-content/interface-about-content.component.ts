import { Component, trigger, transition, style, state, animate, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { ContentLoadService } from '../../../external-services/content-load/content-load.service';

@Component({
  selector: 'app-interface-about-content',
  animations: [
    trigger(
      'interfaceState', [
        state('inactive', style({opacity: 0})),
        state('active', style({opacity: 1})),
        transition('inactive => active', animate('300ms ease-in')),
        transition('active => inactive', animate('300ms ease-out'))
      ]
    )
  ],  
  templateUrl: './interface-about-content.component.html',
  styleUrls: ['./interface-about-content.component.css']
})
export class InterfaceAboutContentComponent {

  constructor(
    protected contentLoadService: ContentLoadService
  ) {
    this.animationState = "inactive";
    this.doneLoadingContent = false;
    this.subscriptions = [];
    this.subscriptions.push(
      this.contentLoadService.doneLoading$.debounce(() => Observable.timer(5)).subscribe(
        (result) => {
          this.doneLoadingContent = result;
          if (!this.doneLoadingContent) {
            this.animationState = 'inactive';
          }
          if (this.doneLoadingContent) {
            this.contentLoadService.removeAllTrackedContent();
            this.animationState = 'active';
          }
        }
      )
    );
  }

  doneLoadingContent: boolean;
  animationState: string;
  subscriptions: Subscription[];

  /**
   * Ensures that service is 'reset' to
   * a fresh state. ngOnDestroy would
   * occur when navigating away
   * from the current route, so we
   * don't want leftover items
   * in our new route.
   */
  ngOnDestroy() {
    this.contentLoadService.removeAllTrackedContent();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}