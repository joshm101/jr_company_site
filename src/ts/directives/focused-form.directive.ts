import { Directive, ElementRef, AfterViewInit, HostListener, EventEmitter, Output } from '@angular/core';

import { AddPostComponent } from '../components/interface/add-post/add-post.component';

@Directive({
  selector: '[focusedForm]'
})

/**
 * This directive emits events that tell our interface
 * whether or not the add post form is focused. We
 * need this information so we know when to expand
 * and collapse the form.
 *
 * The directive is placed at the top level DOM element
 * of the interface component.
 */
export class FocusedFormDirective implements AfterViewInit {
  constructor(el: ElementRef) {
    // grab the current element
    // this directive is an attribute of.
    // In our case, the top level
    // DOM element of the interface component.
    this.element = el;

    // initialize our event emitter.
    this.focused = new EventEmitter<boolean>();
  }

  ngAfterViewInit() {
    // get the add post form wrapper
    this.addPostElement = this.element.nativeElement.querySelector('.add-post-comp-wrap');
  }


  @HostListener('click', ['$event'])
  onClick(event: any) {
    if (this.addPostElement.contains(event.target)) {

      // the click happened inside of the add post
      // form wrapper. So we want to expand the form
      // or maintain expansion if already expanded
      this.focused.emit(true);
    } else {

      // the click happened outside of the
      // add post form wrapper. So we want to
      // collapse the form or keep it collapsed
      // if already collapsed.
      this.focused.emit(false);
    }
  }

  @Output() focused: EventEmitter<boolean>;
  element: ElementRef;
  addPostElement: ElementRef;
}
