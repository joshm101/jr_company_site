import { Directive, HostListener, OnInit, DoCheck, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoResizeTextarea]'
})
export class AutoResizeTextareaDirective implements DoCheck {
  private _textareaElementRef: ElementRef;
  constructor(el: ElementRef) { 
    this._textareaElementRef = el;
  }

  ngDoCheck() {
    this._textareaElementRef.nativeElement.style.height = 'auto';
    this._textareaElementRef.nativeElement.style.height = `${this._textareaElementRef.nativeElement.scrollHeight}px`;
  }

  // @HostListener('input', ['$event.target'])
  // onInput(textareaElementRef: any) {
  //   textareaElementRef.style.height = 'auto';
  //   textareaElementRef.style.height = `${textareaElementRef.scrollHeight}px`;
  // }
}
