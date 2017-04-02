import { Component, trigger, transition, style, state, animate, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ContentLoadService } from '../../../external_services/content-load/content-load-service';

@Component({
  selector: 'int-about-content',
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
  templateUrl: 'interface-about-content.html'
})
export class InterfaceAboutContentComponent implements OnDestroy {
  constructor(
    protected contentLoadService: ContentLoadService
  ) {
    this.animationState = "inactive";
    this.doneLoadingContent = false;
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
    );
  }

  doneLoadingContent: boolean;
  animationState: string;

  ngOnDestroy() {
    this.contentLoadService.removeAllTrackedContent();
  }
}
