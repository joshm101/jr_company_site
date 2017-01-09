import { Component, DoCheck, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs/rx';

import { EmbedPost, EmbedPostService } from '../embed-post/embed-post.index';

@Component({
  selector: 'interface-root',
  templateUrl: 'ts/components/interface/interface.component.html'
})
export class InterfaceRootComponent implements OnInit {
  constructor(
    protected elementRef: ElementRef,
    protected embedPostService: EmbedPostService,
    protected sanitizer: DomSanitizer
  ) {
    this.embedPosts$ = this.embedPostService.getAll();
  }

  removePost(id: string) {
    this.embedPostService.delete(id).take(1).subscribe(
      () => {},
      (error) => {
        console.error(error);
      }
    );
  }

  focusEvent(event: boolean) {
    console.log('focusEvent(): ', event);
    this.focusForm = event;
  }

  formDone() {
    this.focusForm = false;
  }

  ngOnInit() {
    this.calculateColumns();
  }

  // hook into the resize event and check the width of the page/document,
  // setting the number of columns in our grid list as appropriate
  onResize(event: Event) {
    this.calculateColumns();
  }

  calculateColumns() {
    // get current width of screen
    this.screenWidth = this.elementRef.nativeElement.ownerDocument.body.clientWidth;

    // set the number of columns
    // for our grid list depending on the
    // current width.
    if (this.screenWidth >= 1500) {
      this.cols = 4;
      return;
    }
    if (this.screenWidth >= 1250) {
      this.cols = 3;
      return;
    }
    if (this.screenWidth >= 1008) {
      this.cols = 2;
      return;
    }
    if (this.screenWidth < 760) {
      this.cols = 1;
      return;
    }
    this.cols = 2;
  }

  focusForm: boolean = false;
  embedPosts$: Observable<EmbedPost[]>;
  subscriptions: Subscription[];
  screenWidth: number;
  cols: number;
}
