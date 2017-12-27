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
  }

  doneLoadingEventHandler(value: boolean) {
    this.doneLoadingContent = value;
    this.animationState = this.doneLoadingContent ? "active" : "inactive";
  }

  doneLoadingContent: boolean;
  animationState: string;
  subscriptions: Subscription[];

}
